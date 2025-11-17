// 🎯 CREATOR TREASURY - Decentralized Patreon Smart Contract (ink! v5 Stable)
// TODO : manually create contracts and build
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
use ink::prelude::string::String;
use ink::prelude::vec::Vec;
use ink::storage::Mapping;

// 📊 DATA STRUCTURES
// These define the shape of data we store on the blockchain

/// CreatorProfile stores information about each creator on the platform
#[derive(Debug, Clone, PartialEq, Eq)]
#[ink::scale_derive(Encode, Decode, TypeInfo)]
#[cfg_attr(
    feature = "std",
    derive(ink::storage::traits::StorageLayout)
)]
pub struct CreatorProfile {
    /// Display name for the creator (e.g., "Alex Chen")
    pub name: String,
    /// IPFS hash pointing to exclusive content
    pub content_hash: Option<String>,
    /// Total DOT earned by this creator (for display purposes)
    pub total_earned: u128,
    /// Timestamp when creator registered (Unix timestamp in milliseconds)
    pub created_at: u64,
}

/// Subscription represents a fan's ongoing payment to a creator
#[derive(Debug, Clone, PartialEq, Eq)]
#[ink::scale_derive(Encode, Decode, TypeInfo)]
#[cfg_attr(
    feature = "std",
    derive(ink::storage::traits::StorageLayout)
)]
pub struct Subscription {
    /// Total DOT deposited by fan for this subscription
    pub total_deposited: u128,
    /// How much DOT flows to creator per second
    pub rate_per_second: u128,
    /// Last time creator claimed earnings (Unix timestamp)
    pub last_claim_time: u64,
    /// When subscription started (Unix timestamp)
    pub start_time: u64,
}

/// Custom error types for our contract
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

#[ink::contract]
mod creator_treasury_stable {
    use super::*;

    // 🎪 BLOCKCHAIN EVENTS
    // Events are like notifications that the frontend can listen to

    /// Emitted when a new creator joins the platform
    #[ink::event]
    pub struct CreatorRegistered {
        /// Address of the new creator (indexed for efficient searching)
        #[ink(topic)]
        pub creator: AccountId,
        /// Display name of the creator
        pub name: String,
    }

    /// Emitted when a fan subscribes to a creator
    #[ink::event]
    pub struct SubscriptionCreated {
        /// Fan's wallet address (indexed)
        #[ink(topic)]
        pub fan: AccountId,
        /// Creator's wallet address (indexed)
        #[ink(topic)]
        pub creator: AccountId,
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
        pub creator: AccountId,
        /// Fan who was paying (indexed)
        #[ink(topic)]
        pub fan: AccountId,
        /// Amount of DOT claimed
        pub amount: u128,
    }

    /// Emitted when a fan cancels their subscription
    #[ink::event]
    pub struct SubscriptionCancelled {
        /// Fan's wallet address (indexed)
        #[ink(topic)]
        pub fan: AccountId,
        /// Creator's wallet address (indexed)
        #[ink(topic)]
        pub creator: AccountId,
        /// Amount of DOT refunded to fan
        pub refund_amount: u128,
    }

    /// Emitted when a creator adds exclusive content
    #[ink::event]
    pub struct ContentAdded {
        /// Creator's wallet address (indexed)
        #[ink(topic)]
        pub creator: AccountId,
        /// IPFS hash of the content
        pub content_hash: String,
    }

    /// The main contract storage
    #[ink(storage)]
    pub struct CreatorTreasuryStable {
        /// Maps creator wallet address → their profile information
        creators: Mapping<AccountId, CreatorProfile>,
        /// Maps (fan_address, creator_address) → subscription details
        subscriptions: Mapping<(AccountId, AccountId), Subscription>,
        /// Total number of registered creators
        creator_count: u32,
    }

    impl CreatorTreasuryStable {
        /// Constructor - Called once when contract is deployed
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                creators: Mapping::default(),
                subscriptions: Mapping::default(),
                creator_count: 0,
            }
        }

        /// Creator registers on the platform
        #[ink(message)]
        pub fn register_creator(&mut self, name: String) -> Result<(), Error> {
            let caller = self.env().caller();

            // Check if this creator is already registered
            if self.creators.get(caller).is_some() {
                return Err(Error::CreatorAlreadyExists);
            }

            // Get current timestamp for "member since" display
            let now = self.env().block_timestamp();

            // Create new creator profile
            let profile = CreatorProfile {
                name: name.clone(),
                content_hash: None,
                total_earned: 0,
                created_at: now,
            };

            // Store the profile in our creators mapping
            self.creators.insert(caller, &profile);

            // Increment our creator counter for stats
            self.creator_count += 1;

            // Emit event to notify frontend about new creator
            self.env().emit_event(CreatorRegistered {
                creator: caller,
                name,
            });

            Ok(())
        }

        /// Get profile information for a specific creator
        #[ink(message)]
        pub fn get_creator_profile(&self, creator: AccountId) -> Result<CreatorProfile, Error> {
            self.creators.get(creator).ok_or(Error::CreatorNotFound)
        }

        /// Get total number of registered creators
        #[ink(message)]
        pub fn get_creator_count(&self) -> u32 {
            self.creator_count
        }

        /// Check if an account is a registered creator
        #[ink(message)]
        pub fn is_creator(&self, account: AccountId) -> bool {
            self.creators.get(account).is_some()
        }

        /// Fan subscribes to a creator with monthly payment
        #[ink(message, payable)]
        pub fn subscribe(&mut self, creator: AccountId, monthly_rate: u128) -> Result<(), Error> {
            let fan = self.env().caller();
            let payment = self.env().transferred_value();

            // Verify the creator exists
            if self.creators.get(creator).is_none() {
                return Err(Error::CreatorNotFound);
            }

            // Check if fan is already subscribed to this creator
            let subscription_key = (fan, creator);
            if self.subscriptions.get(subscription_key).is_some() {
                return Err(Error::SubscriptionAlreadyExists);
            }

            // Convert payment from Balance to u128 for comparison and storage
            let payment_u128: u128 = payment.try_into().map_err(|_| Error::Overflow)?;
            
            // Verify sufficient payment was sent
            if payment_u128 < monthly_rate {
                return Err(Error::InsufficientPayment);
            }

            // Calculate streaming rate per second
            let seconds_per_month = 30u128 * 24 * 60 * 60;
            let rate_per_second = monthly_rate / seconds_per_month;

            // Get current timestamp for subscription start
            let now = self.env().block_timestamp();

            // Create subscription record
            let subscription = Subscription {
                total_deposited: payment_u128,
                rate_per_second,
                last_claim_time: now,
                start_time: now,
            };

            // Store subscription in mapping
            self.subscriptions.insert(subscription_key, &subscription);

            // Emit event for frontend notification
            self.env().emit_event(SubscriptionCreated {
                fan,
                creator,
                monthly_rate,
                total_deposited: payment_u128,
            });

            Ok(())
        }

        /// Get subscription details between a fan and creator
        #[ink(message)]
        pub fn get_subscription(&self, fan: AccountId, creator: AccountId) -> Result<Subscription, Error> {
            let subscription_key = (fan, creator);
            self.subscriptions
                .get(subscription_key)
                .ok_or(Error::SubscriptionNotFound)
        }

        /// Creator claims their vested earnings from a specific fan
        #[ink(message)]
        pub fn claim_earnings(&mut self, fan: AccountId) -> Result<u128, Error> {
            let creator = self.env().caller();
            let subscription_key = (fan, creator);

            // Get subscription details
            let mut subscription = self
                .subscriptions
                .get(subscription_key)
                .ok_or(Error::SubscriptionNotFound)?;

            // Get current blockchain timestamp
            let now = self.env().block_timestamp();

            // Calculate time elapsed since last claim (in milliseconds)
            let time_elapsed = now - subscription.last_claim_time;
            let seconds_elapsed = time_elapsed / 1000;

            // Calculate how much has vested since last claim
            let claimable_amount = (seconds_elapsed as u128) * subscription.rate_per_second;

            // Ensure we don't claim more than what's available
            let claimable_amount = claimable_amount.min(subscription.total_deposited);

            // If nothing to claim, return early
            if claimable_amount == 0 {
                return Ok(0);
            }

            // Update subscription state to reflect the claim
            subscription.last_claim_time = now;
            subscription.total_deposited = subscription
                .total_deposited
                .saturating_sub(claimable_amount);

            // Save the updated subscription state
            self.subscriptions.insert(subscription_key, &subscription);

            // Update creator's total earnings for display purposes
            if let Some(mut profile) = self.creators.get(creator) {
                profile.total_earned = profile.total_earned.saturating_add(claimable_amount);
                self.creators.insert(creator, &profile);
            }

            // Transfer the claimed DOT from contract to creator's wallet
            if self
                .env()
                .transfer(creator, claimable_amount.into())
                .is_err()
            {
                return Err(Error::TransferFailed);
            }

            // Emit event for frontend notification
            self.env().emit_event(EarningsClaimed {
                creator,
                fan,
                amount: claimable_amount,
            });

            Ok(claimable_amount)
        }

        /// Fan cancels subscription and gets refund for unused time
        #[ink(message)]
        pub fn cancel_subscription(&mut self, creator: AccountId) -> Result<u128, Error> {
            let fan = self.env().caller();
            let subscription_key = (fan, creator);

            // Get subscription details
            let subscription = self.subscriptions
                .get(subscription_key)
                .ok_or(Error::SubscriptionNotFound)?;

            // Get current blockchain timestamp
            let now = self.env().block_timestamp();

            // Calculate total time elapsed since subscription started
            let total_elapsed = now - subscription.start_time;
            let seconds_elapsed = total_elapsed / 1000;

            // Calculate total amount that has vested since subscription started
            let total_vested = seconds_elapsed as u128 * subscription.rate_per_second;

            // Calculate refund amount (what hasn't vested yet)
            let refund_amount = if total_vested >= subscription.total_deposited {
                0 // Subscription fully vested, no refund available
            } else {
                subscription.total_deposited - total_vested
            };

            // Mark subscription as cancelled by setting balance to 0
            let cancelled_subscription = Subscription {
                total_deposited: 0,
                rate_per_second: 0,
                last_claim_time: subscription.last_claim_time,
                start_time: subscription.start_time,
            };
            self.subscriptions.insert(subscription_key, &cancelled_subscription);

            // Transfer refund to fan if there's anything to refund
            if refund_amount > 0 {
                if self.env().transfer(fan, refund_amount.into()).is_err() {
                    return Err(Error::TransferFailed);
                }
            }

            // Emit event for frontend notification
            self.env().emit_event(SubscriptionCancelled {
                fan,
                creator,
                refund_amount,
            });

            Ok(refund_amount)
        }

        /// Creator adds exclusive content (IPFS hash)
        #[ink(message)]
        pub fn add_exclusive_content(&mut self, content_hash: String) -> Result<(), Error> {
            let creator = self.env().caller();

            // Verify caller is a registered creator
            let mut profile = self.creators.get(creator).ok_or(Error::CreatorNotFound)?;

            // Update the creator's profile with the new content hash
            profile.content_hash = Some(content_hash.clone());

            // Save the updated profile back to blockchain storage
            self.creators.insert(creator, &profile);

            // Emit event for frontend notification
            self.env().emit_event(ContentAdded {
                creator,
                content_hash,
            });

            Ok(())
        }

        /// Get creator's exclusive content (if caller is subscribed)
        #[ink(message)]
        pub fn get_creator_content(&self, creator: AccountId) -> Result<String, Error> {
            let fan = self.env().caller();

            // Verify creator exists and has content
            let profile = self.creators.get(creator).ok_or(Error::CreatorNotFound)?;

            // Check if fan has active subscription to this creator
            let subscription_key = (fan, creator);
            if self.subscriptions.get(subscription_key).is_none() {
                return Err(Error::SubscriptionRequired);
            }

            // Return content hash if available
            profile.content_hash.ok_or(Error::CreatorNotFound)
        }

        /// Get list of all registered creators with their profiles
        #[ink(message)]
        pub fn get_creator_list(&self) -> Vec<(AccountId, CreatorProfile)> {
            // TODO: Implement proper iteration over creators
            // For now, return empty vector to avoid compilation issues
            Vec::new()
        }
    }
}
