import RegistryVotingContract from Project.RegistryVotingContract

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