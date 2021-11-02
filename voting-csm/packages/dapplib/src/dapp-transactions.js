// 🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨
// ⚠️ THIS FILE IS AUTO-GENERATED WHEN packages/dapplib/interactions CHANGES
// DO **** NOT **** MODIFY CODE HERE AS IT WILL BE OVER-WRITTEN
// 🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨

const fcl = require("@onflow/fcl");

module.exports = class DappTransactions {

	static registry_receive_auth_nft() {
		return fcl.transaction`
				import RegistryService from 0x01cf0e2f2f715450
				
				// Allows a Tenant to register with the RegistryService. It will
				// save an AuthNFT to account storage. Once an account
				// has an AuthNFT, they can then get Tenant Resources from any contract
				// in the Registry.
				//
				// Note that this only ever needs to be called once per Tenant
				
				transaction() {
				
				    prepare(signer: AuthAccount) {
				        // if this account doesn't already have an AuthNFT...
				        if signer.borrow<&RegistryService.AuthNFT>(from: RegistryService.AuthStoragePath) == nil {
				            // save a new AuthNFT to account storage
				            signer.save(<-RegistryService.register(), to: RegistryService.AuthStoragePath)
				
				            // we only expose the IAuthNFT interface so all this does is allow us to read
				            // the authID inside the AuthNFT reference
				            signer.link<&RegistryService.AuthNFT{RegistryService.IAuthNFT}>(RegistryService.AuthPublicPath, target: RegistryService.AuthStoragePath)
				        }
				    }
				
				    execute {
				
				    }
				}
		`;
	}

	static registry_receive_tenant() {
		return fcl.transaction`
				import RegistryVotingContract from 0x01cf0e2f2f715450
				import RegistryService from 0x01cf0e2f2f715450
				
				// This transaction allows any Tenant to receive a Tenant Resource from
				// RegistryVotingContract. It saves the resource to account storage.
				//
				// Note that this can only be called by someone who has already registered
				// with the RegistryService and received an AuthNFT.
				
				transaction() {
				
				  prepare(signer: AuthAccount) {
				    // save the Tenant resource to the account if it doesn't already exist
				    if signer.borrow<&RegistryVotingContract.Tenant>(from: RegistryVotingContract.TenantStoragePath) == nil {
				      // borrow a reference to the AuthNFT in account storage
				      let authNFTRef = signer.borrow<&RegistryService.AuthNFT>(from: RegistryService.AuthStoragePath)
				                        ?? panic("Could not borrow the AuthNFT")
				
				      // save the new Tenant resource from RegistryVotingContract to account storage
				      signer.save(<-RegistryVotingContract.instance(authNFT: authNFTRef), to: RegistryVotingContract.TenantStoragePath)
				
				      // link the Tenant resource to the public
				      //
				      // NOTE: this is commented out for now because it is dangerous to link
				      // our Tenant to the public without any resource interfaces restricting it.
				      // If you add resource interfaces that Tenant must implement, you can
				      // add those here and then uncomment the line below.
				      // 
				      signer.link<&RegistryVotingContract.Tenant{RegistryVotingContract.ITenantPublic, RegistryVotingContract.ITenantBallot}>
				        (RegistryVotingContract.TenantPublicPath, target: RegistryVotingContract.TenantStoragePath)
				    }
				  }
				
				  execute {
				    log("Registered a new Tenant for RegistryVotingContract.")
				  }
				}
				
		`;
	}

	static voting_create_proposal() {
		return fcl.transaction`
				import RegistryVotingContract from 0x01cf0e2f2f715450
				
				// Allows an Admin to create a new proposal.
				
				transaction(proposalDesc: String) {
				
				    let tenantRef: &RegistryVotingContract.Tenant{RegistryVotingContract.ITenantAdmin}
				    let adminRef: &RegistryVotingContract.Admin
				
				    prepare(signer: AuthAccount){
				
				        if (proposalDesc.length == 0) {
				            panic("Proposal description must be provided")
				        }
				
				        self.tenantRef = signer.borrow<&RegistryVotingContract.Tenant{RegistryVotingContract.ITenantAdmin}>(from: RegistryVotingContract.TenantStoragePath) 
				            ?? panic("Couldn't borrow the tenant resource")
				
				        self.adminRef = self.tenantRef.adminRef()
				    }
				
				    execute{
				        self.adminRef.createProposal(_tenantRef: self.tenantRef, proposalDes: proposalDesc)
				    }
				}
		`;
	}

	static voting_issue_ballot() {
		return fcl.transaction`
				import RegistryVotingContract from 0x01cf0e2f2f715450
				
				// Allows an account with an Admin resource to issue a Ballot to another user.
				
				transaction(_signer: Address, _recipient: Address, _proposalId: UInt64, ) {
				    let tenantRef: &RegistryVotingContract.Tenant{RegistryVotingContract.ITenantAdmin}
				    let adminRef: &RegistryVotingContract.Admin
				    prepare(signer: AuthAccount, recipient: AuthAccount) {
				        self.tenantRef = signer.borrow<&RegistryVotingContract.Tenant{RegistryVotingContract.ITenantAdmin}>
				            (from: RegistryVotingContract.TenantStoragePath) ?? panic("Couldn't get tenant ref")
				        self.adminRef = self.tenantRef.adminRef()
				
				        if recipient.borrow<&RegistryVotingContract.BallotCollection>(from: RegistryVotingContract.BallotCollectionStoragePath) == nil {
				            let ballotCollection: @RegistryVotingContract.BallotCollection <- RegistryVotingContract.createBallotCollection()
				
				            recipient.save(<- ballotCollection, to: RegistryVotingContract.BallotCollectionStoragePath)
				
				            recipient.link<&RegistryVotingContract.BallotCollection{RegistryVotingContract.IBallotCollection}>
				                (RegistryVotingContract.BallotCollectionPublicPath, target: RegistryVotingContract.BallotCollectionStoragePath)
				
				            log("Created new ballot collection for recipient and saved to storage")
				        }
				
				        let ballot <- self.adminRef.issueBallot(_tenantRef: self.tenantRef, proposalId: _proposalId, voter: recipient.address)
				        let recipientBallotCollection = recipient.borrow<&RegistryVotingContract.BallotCollection>(from: RegistryVotingContract.BallotCollectionStoragePath) 
				            ?? panic("Couldn't borrow ballot collection from storage")
				
				        recipientBallotCollection.deposit(ballot: <- ballot)
				
				        log("issued ballot to recipient")
				    }
				
				    execute {}
				
				}
		`;
	}

	static voting_vote_on_ballot() {
		return fcl.transaction`
				import RegistryVotingContract from 0x01cf0e2f2f715450
				
				transaction (issuer: Address, signer: Address, proposalId: UInt64, decision: Bool) {
				    let tenantRef: &RegistryVotingContract.Tenant{RegistryVotingContract.ITenantBallot}
				    let ballotCollectionRef: &RegistryVotingContract.BallotCollection
				
				    prepare(signer: AuthAccount) {
				        self.tenantRef = getAccount(issuer).getCapability<&RegistryVotingContract.Tenant{RegistryVotingContract.ITenantBallot}>(RegistryVotingContract.TenantPublicPath).borrow()
				            ?? panic("Couldn't get a reference to the tenant ref")
				        self.ballotCollectionRef = signer.borrow<&RegistryVotingContract.BallotCollection>(from: RegistryVotingContract.BallotCollectionStoragePath)
				            ?? panic("Couldn't get ballot collection ref")
				    }
				
				    execute {
				        self.ballotCollectionRef.voteOnProposal(_tenantRef: self.tenantRef, proposalId: proposalId, decision: decision)
				    }
				
				}
				
				
		`;
	}

}
