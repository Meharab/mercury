
import RegistryVotingContract from Project.RegistryVotingContract

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