import { contracts } from "@polkadot-api/descriptors"
import * as flipperPassethub from "contracts/deployments/flipper/passethub"
import * as flipperPop from "contracts/deployments/flipper/pop"
import * as creatorTreasuryPassethub from "contracts/deployments/creator_treasury/passethub"
// import * as flipperDev from "contracts/deployments/flipper/dev"

export const flipper = {
  contract: contracts.flipper,
  evmAddresses: {
    // dev: flipperDev.evmAddress,
    pop: flipperPop.evmAddress,
    passethub: flipperPassethub.evmAddress,
    // Add more deployments here
  },
  ss58Addresses: {
    // dev: flipperDev.ss58Address,
    pop: flipperPop.ss58Address,
    passethub: flipperPassethub.ss58Address,
    // Add more deployments here
  },
}

export const creatorTreasury = {
  contract: contracts.creator_treasury,
  evmAddresses: {
    passethub: creatorTreasuryPassethub.evmAddress,
    // Add more deployments here
  },
  ss58Addresses: {
    passethub: creatorTreasuryPassethub.ss58Address,
    // Add more deployments here
  },
}

export const deployments = {
  flipper,
  creatorTreasury,
  // Add more contracts here
}
