# decentralised patreon

1. ink! Smart Contract (The "Creator's Treasury")

This one contract will handle all logic.

Creator Functions:

fn register_creator(name: String): Adds the creator to a public list.

fn add_exclusive_content(&mut self, ipfs_hash: String): Creator posts a link to their "exclusive content."

fn claim_earnings(&mut self): Creator withdraws their accrued (vested) funds.

Fan Functions:

fn subscribe(&mut self, creator_id: AccountId, monthly_rate: Balance): A payable function. The fan deposits funds and sets a monthly "drip rate."

fn cancel_subscription(&mut self, creator_id: AccountId): Fan instantly withdraws all un-vested funds.

Public Functions:

fn get_creator_list(): Returns all creators.

fn get_creator_content(creator_id: AccountId): A "read" function that checks if the caller is an active subscriber. If YES, it returns the ipfs_hash. If NO, it returns an error.

2. inkathon React Frontend (The User Interface)

Creator Page: A public page that lists all creators.

Creator "Portal":

A "Subscribe" button (calls subscribe()).

A "Cancel" button (calls cancel_subscription()).

An "Exclusive Content" section that calls get_creator_content(). If it gets a hash, it displays a link. If it gets an error, it displays a "Subscribe to Unlock" message.

Creator "Dashboard":

A text box to call add_exclusive_content().

A "Claim Earnings" button (calls claim_earnings()).

12-Hour MVP Build Plan
This is an ambitious 12-hour sprint.

Phase 1: The Contract (4 Hours)

Use your inkathon template: cargo contract new decentralized_patreon.

Define your Storage struct. This is the hardest part. You'll need:

A Mapping<AccountId, CreatorProfile>.

A Mapping<(AccountId, AccountId), Subscription> (Fan -> Creator).

CreatorProfile will store name, ipfs_hash, and total_balance.

Subscription will store total_deposit, rate_per_second, last_claimed_time.

Implement the register_creator and add_exclusive_content functions.

Implement the subscribe function.

Implement the vesting math for claim_earnings and cancel_subscription. (This is where you'll spend most of your time).

Deploy to the Shibuya testnet.

Phase 2: The Frontend (5 Hours)

Use the inkathon frontend.

Build the "Home" page: Call get_creator_list() and display them.

Build the "Creator" page:

Add the "Subscribe" UI (text box for monthly_rate + "Subscribe" button).

Add the "Cancel" button.

Implement the "Content Gating" logic: call get_creator_content(). On Ok, show the link. On Err, show the "Subscribe" button.

Build the "Dashboard" page (for creators):

Add the "Claim Earnings" button.

Add the "Add Content" text box.

Phase 3: Integration & Testing (3 Hours)

Create 2 test accounts: "Creator" and "Fan."

Test Flow 1 (Happy Path):

Creator registers.

Creator adds a "locked" IPFS hash.

Fan fails to see the hash.

Fan subscribes.

Fan succeeds in seeing the hash.

Test Flow 2 (Vesting):

Wait 5 minutes.

Creator claims their earnings.

Test Flow 3 (User Control):

Fan cancels their subscription and instantly gets their remaining funds back.

This is a complete, impressive, and "radically useful" project that perfectly fits the theme and is achievable in 12 hours.
