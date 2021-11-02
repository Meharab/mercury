import RegistryService from Project.RegistryService

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