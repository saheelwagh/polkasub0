// 🎯 CREATOR TREASURY - Decentralized Patreon Smart Contract
//
// This contract enables creators to receive streaming payments from fans
// in exchange for exclusive content access. Think of it as a decentralized
// subscription service where payments flow continuously rather than monthly.
//
// Key Features:
// - Creators register and upload exclusive content
// - Fans subscribe with DOT payments that stream per-second
// - Creators can claim earnings anytime
// - Fans can cancel and get refunds for unused time
// - Content is gated behind active subscriptions

#![cfg_attr(not(feature = "std"), no_std, no_main)]

// Import ink! framework components
// ink! is Rust-based smart contract language for Polkadot
use ink::prelude::string::String;
use ink::prelude::vec::Vec;
use ink::storage::Mapping;

// 📊 DATA STRUCTURES
// These define the shape of data we store on the blockchain

/// CreatorProfile stores information about each creator on the platform
/// This data is permanent and publicly readable on the blockchain
#[derive(Debug, Clone, PartialEq, Eq)]
#[ink::scale_derive(Encode, Decode, TypeInfo)]
pub struct CreatorProfile {
    /// Display name for the creator (e.g., "Alex Chen")
    /// This is what fans see when browsing creators
    pub name: String,

    /// IPFS hash pointing to exclusive content
    /// IPFS is a decentralized file storage system
    /// Example: "QmX7M9CiYXjVQX8Z2HvjKq4XvLqWjAoKGmhq9F3nR8sT4u"
    pub content_hash: Option<String>,

    /// Total DOT earned by this creator (for display purposes)
    /// Measured in Planck units (1 DOT = 10^12 Planck)
    pub total_earned: u128,

    /// Timestamp when creator registered (Unix timestamp in milliseconds)
    /// Used to show "Member since" information
    pub created_at: u64,
}

/// Subscription represents a fan's ongoing payment to a creator
/// This tracks the streaming payment relationship between two accounts
#[derive(Debug, Clone, PartialEq, Eq)]
#[ink::scale_derive(Encode, Decode, TypeInfo)]
pub struct Subscription {
    /// Total DOT deposited by fan for this subscription
    /// This is the "prepaid balance" that streams to the creator
    pub total_deposited: u128,

    /// How much DOT flows to creator per second
    /// Calculated as: monthly_rate / (30 * 24 * 60 * 60)
    /// Example: 5 DOT/month = 1,929 Planck/second
    pub rate_per_second: u128,

    /// Last time creator claimed earnings (Unix timestamp)
    /// Used to calculate how much has vested since last claim
    pub last_claim_time: u64,

    /// When subscription started (Unix timestamp)
    /// Used to calculate total elapsed time for refunds
    pub start_time: u64,
}

/// Custom error types for our contract
/// These provide clear feedback when operations fail
#[derive(Debug, PartialEq, Eq)]
#[ink::scale_derive(Encode, Decode, TypeInfo)]
pub enum Error {
    /// Creator is already registered (can't register twice)
    CreatorAlreadyExists,

    /// Trying to access a creator that doesn't exist
    CreatorNotFound,

    /// Fan is already subscribed to this creator
    SubscriptionAlreadyExists,

    /// Trying to access a subscription that doesn't exist
    SubscriptionNotFound,

    /// Fan doesn't have active subscription to access content
    SubscriptionRequired,

    /// Not enough DOT sent with the transaction
    InsufficientPayment,

    /// Mathematical overflow (safety check)
    Overflow,

    /// Transfer of DOT failed
    TransferFailed,
}

// 🎪 BLOCKCHAIN EVENTS
// Events are like notifications that the frontend can listen to
// They're emitted when important things happen in the contract

/// Emitted when a new creator joins the platform
#[ink::event]
pub struct CreatorRegistered {
    /// Address of the new creator (indexed for efficient searching)
    #[ink(topic)]
    pub creator: ink::primitives::AccountId,

    /// Display name of the creator
    pub name: String,
}

/// Emitted when a fan subscribes to a creator
#[ink::event]
pub struct SubscriptionCreated {
    /// Fan's wallet address (indexed)
    #[ink(topic)]
    pub fan: ink::primitives::AccountId,

    /// Creator's wallet address (indexed)
    #[ink(topic)]
    pub creator: ink::primitives::AccountId,

    /// Monthly rate in DOT (for display)
    pub monthly_rate: u128,

    /// Total DOT deposited
    pub total_deposited: u128,
}

/// Emitted when a creator claims their earnings
#[ink::event]
pub struct EarningsClaimed {
    /// Creator's wallet address (indexed)
    #[ink(topic)]
    pub creator: ink::primitives::AccountId,

    /// Fan who was paying (indexed)
    #[ink(topic)]
    pub fan: ink::primitives::AccountId,

    /// Amount of DOT claimed
    pub amount: u128,
}

/// Emitted when a fan cancels their subscription
#[ink::event]
pub struct SubscriptionCancelled {
    /// Fan's wallet address (indexed)
    #[ink(topic)]
    pub fan: ink::primitives::AccountId,

    /// Creator's wallet address (indexed)
    #[ink(topic)]
    pub creator: ink::primitives::AccountId,

    /// Amount of DOT refunded to fan
    pub refund_amount: u128,
}

/// Emitted when a creator adds exclusive content
#[ink::event]
pub struct ContentAdded {
    /// Creator's wallet address (indexed)
    #[ink(topic)]
    pub creator: ink::primitives::AccountId,

    /// IPFS hash of the content
    pub content_hash: String,
}

// 🏗️ MAIN CONTRACT STRUCTURE
// This is the "database" that lives on the blockchain

#[ink::contract]
mod creator_treasury_pop {
    use super::*;

    /// The main contract storage
    /// Think of this as a database with tables for creators and subscriptions
    #[ink(storage)]
    pub struct CreatorTreasuryPop {
        /// Maps creator wallet address → their profile information
        /// Like a "creators" table in a database
        /// Key: AccountId (wallet address)
        /// Value: CreatorProfile (name, content, earnings, etc.)
        creators: Mapping<ink::primitives::AccountId, CreatorProfile>,

        /// Maps (fan_address, creator_address) → subscription details
        /// Like a "subscriptions" table with composite key
        /// Key: (fan's AccountId, creator's AccountId)
        /// Value: Subscription (payment details, timing, etc.)
        subscriptions:
            Mapping<(ink::primitives::AccountId, ink::primitives::AccountId), Subscription>,

        /// Total number of registered creators
        /// Used for displaying stats and iteration
        creator_count: u32,
    }

    impl CreatorTreasuryPop {
        /// 🏁 CONSTRUCTOR - Called once when contract is deployed
        /// This initializes the contract with empty storage
        /// No parameters needed - we start with zero creators and subscriptions
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                creators: Mapping::default(),
                subscriptions: Mapping::default(),
                creator_count: 0,
            }
        }

        // 👥 CREATOR MANAGEMENT FUNCTIONS
        // These functions handle creator registration and profile management

        /// Register a new creator on the platform
        /// This is like "signing up" to become a content creator
        ///
        /// Parameters:
        /// - name: Display name for the creator (e.g., "Alex Chen")
        ///
        /// Returns:
        /// - Ok(()) if registration successful
        /// - Err(CreatorAlreadyExists) if already registered
        #[ink(message)]
        pub fn register_creator(&mut self, name: String) -> Result<(), Error> {
            // Get the wallet address of whoever called this function
            // In Web3, every transaction has a "sender" - the person who signed it
            let caller = self.env().caller();

            // Check if this creator is already registered
            // We don't want duplicate registrations
            if self.creators.contains(caller) {
                return Err(Error::CreatorAlreadyExists);
            }

            // Get current timestamp for "member since" display
            // Block timestamp is provided by the blockchain
            let now = self.env().block_timestamp();

            // Create new creator profile with provided information
            let profile = CreatorProfile {
                name: name.clone(),
                content_hash: None, // No content uploaded yet
                total_earned: 0,    // Haven't earned anything yet
                created_at: now,    // Record registration time
            };

            // Store the profile in our creators mapping
            // This permanently saves it to the blockchain
            self.creators.insert(caller, &profile);

            // Increment our creator counter for stats
            self.creator_count += 1;

            // Emit event to notify frontend about new creator
            // The frontend can listen for this and update the UI
            self.env().emit_event(CreatorRegistered {
                creator: caller,
                name,
            });

            Ok(())
        }

        /// Get profile information for a specific creator
        /// Used to display creator details on their profile page
        ///
        /// Parameters:
        /// - creator: Wallet address of the creator
        ///
        /// Returns:
        /// - Ok(CreatorProfile) if creator exists
        /// - Err(CreatorNotFound) if creator doesn't exist
        #[ink(message)]
        pub fn get_creator_profile(
            &self,
            creator: ink::primitives::AccountId,
        ) -> Result<CreatorProfile, Error> {
            self.creators.get(creator).ok_or(Error::CreatorNotFound)
        }

        /// Get total number of registered creators
        /// Used for displaying platform statistics
        ///
        /// Returns:
        /// - Number of creators as u32
        #[ink(message)]
        pub fn get_creator_count(&self) -> u32 {
            self.creator_count
        }

        /// Check if an account is a registered creator
        /// Used for access control and UI logic
        ///
        /// Parameters:
        /// - account: Wallet address to check
        ///
        /// Returns:
        /// - true if account is registered creator
        /// - false otherwise
        #[ink(message)]
        pub fn is_creator(&self, account: ink::primitives::AccountId) -> bool {
            self.creators.contains(account)
        }

        // 💰 SUBSCRIPTION MANAGEMENT FUNCTIONS
        // These functions handle the core subscription and payment logic

        /// Fan subscribes to a creator with monthly payment
        /// This is the core function that starts the streaming payment relationship
        ///
        /// The function is marked "payable" which means it can receive DOT
        /// The DOT sent with the transaction becomes the subscription balance
        ///
        /// Parameters:
        /// - creator: Wallet address of creator to subscribe to
        /// - monthly_rate: How much DOT per month (in Planck units)
        ///
        /// Returns:
        /// - Ok(()) if subscription successful
        /// - Err(...) for various failure conditions
        #[ink(message, payable)]
        pub fn subscribe(
            &mut self,
            creator: ink::primitives::AccountId,
            monthly_rate: u128,
        ) -> Result<(), Error> {
            let fan = self.env().caller();
            let payment = self.env().transferred_value();

            // Verify the creator exists
            if !self.creators.contains(creator) {
                return Err(Error::CreatorNotFound);
            }

            // Check if fan is already subscribed to this creator
            let subscription_key = (fan, creator);
            if self.subscriptions.contains(subscription_key) {
                return Err(Error::SubscriptionAlreadyExists);
            }

            // Verify sufficient payment was sent
            // Fan should send at least the monthly rate
            if payment < monthly_rate {
                return Err(Error::InsufficientPayment);
            }

            // Calculate streaming rate per second
            // 30 days = 30 * 24 * 60 * 60 = 2,592,000 seconds
            let seconds_per_month = 30u128 * 24 * 60 * 60;
            let rate_per_second = monthly_rate / seconds_per_month;

            // Get current timestamp for subscription start
            let now = self.env().block_timestamp();

            // Create subscription record
            let subscription = Subscription {
                total_deposited: payment,
                rate_per_second,
                last_claim_time: now, // Creator can claim immediately
                start_time: now,
            };

            // Store subscription in mapping
            self.subscriptions.insert(subscription_key, &subscription);

            // Emit event for frontend notification
            self.env().emit_event(SubscriptionCreated {
                fan,
                creator,
                monthly_rate,
                total_deposited: payment,
            });

            Ok(())
        }

        /// Get subscription details between a fan and creator
        /// Used by frontend to display subscription status
        ///
        /// Parameters:
        /// - fan: Fan's wallet address
        /// - creator: Creator's wallet address
        ///
        /// Returns:
        /// - Ok(Subscription) if subscription exists
        /// - Err(SubscriptionNotFound) if no subscription
        #[ink(message)]
        pub fn get_subscription(
            &self,
            fan: ink::primitives::AccountId,
            creator: ink::primitives::AccountId,
        ) -> Result<Subscription, Error> {
            let subscription_key = (fan, creator);
            self.subscriptions
                .get(subscription_key)
                .ok_or(Error::SubscriptionNotFound)
        }
    }

    // 🧪 UNIT TESTS
    // These tests verify our contract logic works correctly
    // Run with: cargo test

    #[cfg(test)]
    mod tests {
        use super::*;

        /// Test that creators can register successfully
        #[ink::test]
        fn test_creator_registration() {
            let mut contract = CreatorTreasuryPop::new();

            // Register a creator
            let result = contract.register_creator("Alice".to_string());
            assert!(result.is_ok());

            // Verify creator count increased
            assert_eq!(contract.get_creator_count(), 1);

            // Verify creator exists
            let alice = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>().alice;
            assert!(contract.is_creator(alice));
        }

        /// Test that duplicate registration fails
        #[ink::test]
        fn test_duplicate_registration_fails() {
            let mut contract = CreatorTreasuryPop::new();

            // Register creator once
            let result1 = contract.register_creator("Alice".to_string());
            assert!(result1.is_ok());

            // Try to register again - should fail
            let result2 = contract.register_creator("Alice Again".to_string());
            assert_eq!(result2, Err(Error::CreatorAlreadyExists));
        }

        /// Test subscription creation
        #[ink::test]
        fn test_subscription_creation() {
            let mut contract = CreatorTreasuryPop::new();
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();

            // Set up: Alice is creator, Bob is fan
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);
            contract.register_creator("Alice".to_string()).unwrap();

            // Bob subscribes to Alice
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.bob);
            ink::env::test::set_value_transferred::<ink::env::DefaultEnvironment>(
                5_000_000_000_000,
            ); // 5 DOT

            let result = contract.subscribe(accounts.alice, 5_000_000_000_000);
            assert!(result.is_ok());

            // Verify subscription exists
            let subscription = contract.get_subscription(accounts.bob, accounts.alice);
            assert!(subscription.is_ok());
        }
    }
}
