import RegistryService from Project.RegistryService

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