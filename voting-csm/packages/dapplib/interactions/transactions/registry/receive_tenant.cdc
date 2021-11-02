import RegistryVotingContract from Project.RegistryVotingContract
import RegistryService from Project.RegistryService

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
