// 🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨
// ⚠️ THIS FILE IS AUTO-GENERATED WHEN packages/dapplib/interactions CHANGES
// DO **** NOT **** MODIFY CODE HERE AS IT WILL BE OVER-WRITTEN
// 🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨

const fcl = require("@onflow/fcl");

module.exports = class DappScripts {

	static flowtoken_get_balance() {
		return fcl.script`
				import FungibleToken from 0xee82856bf20e2aa6
				import FlowToken from 0x0ae53cb6e3f42a79
				
				pub fun main(account: Address): UFix64 {
				
				    let vaultRef = getAccount(account)
				        .getCapability(/public/flowTokenBalance)
				        .borrow<&FlowToken.Vault{FungibleToken.Balance}>()
				        ?? panic("Could not borrow Balance reference to the Vault")
				
				    return vaultRef.balance
				}  
		`;
	}

	static voting_list_ballots() {
		return fcl.script`
				
				import RegistryVotingContract from 0x01cf0e2f2f715450
				
				// lists all the ballots that have been issued to a given account
				
				pub fun main(account: Address): [UInt64]? {
				
				    let publicAccount = getAccount(account)
				    if let ballotCollectionRef = publicAccount.getCapability<&RegistryVotingContract.BallotCollection{RegistryVotingContract.IBallotCollection}>
				            (RegistryVotingContract.BallotCollectionPublicPath).borrow() {
				        let ballotArray = ballotCollectionRef.listBallots()
				        return ballotArray
				    }
				    return nil
				}
		`;
	}

	static voting_list_proposals() {
		return fcl.script`
				
				import RegistryVotingContract from 0x01cf0e2f2f715450
				
				// lists all the proposals for a given Tenant resource that is associated with an account.
				
				pub fun main(tenantAccount: Address): [RegistryVotingContract.Proposal]? {
				
				    let publicAccount = getAccount(tenantAccount)
				    if let tenantRef = publicAccount.getCapability<&RegistryVotingContract.Tenant{RegistryVotingContract.ITenantPublic}>
				            (RegistryVotingContract.TenantPublicPath).borrow() {
				        let proposalArray = RegistryVotingContract.listProposals(_tenantRef: tenantRef)
				        return proposalArray
				    }
				    return nil
				}
		`;
	}

	static registry_has_auth_nft() {
		return fcl.script`
				import RegistryService from 0x01cf0e2f2f715450
				
				// Checks to see if an account has an AuthNFT
				
				pub fun main(tenant: Address): Bool {
				    let hasAuthNFT = getAccount(tenant).getCapability(RegistryService.AuthPublicPath)
				                        .borrow<&RegistryService.AuthNFT{RegistryService.IAuthNFT}>()
				
				    if hasAuthNFT == nil {
				        return false
				    } else {
				        log("They have an auth NFT")
				        return true
				    }
				}
		`;
	}

}
