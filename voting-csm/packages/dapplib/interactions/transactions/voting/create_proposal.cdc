import RegistryVotingContract from Project.RegistryVotingContract

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