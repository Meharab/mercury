import RegistryVotingContract from Project.RegistryVotingContract

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

