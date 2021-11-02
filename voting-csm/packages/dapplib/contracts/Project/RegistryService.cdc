pub contract RegistryService {
    pub var totalSupply: UInt64

    // IAuthNFT
    // A resource interface that lets us expose
    // just the authID to the public. This is mainly
    // used so we can check if a AuthNFT exists in an
    // account in the has_auth_nft.cdc script.
    //
    pub resource interface IAuthNFT {
        pub let authID: UInt64
    }

    // AuthNFT
    // The AuthNFT exists so an owner of a DappContract
    // can "register" with this RegistryService contract in order
    // to use contracts that exist within the Registry.
    //
    // This will only need to be acquired one time.
    // Ex. A new account comes to the Registry, gets this AuthNFT,
    // and can now interact and retrieve Tenants from whatever
    // Registry contracts they want. They will never have to get another
    // AuthNFT.
    //
    pub resource AuthNFT: IAuthNFT {
        // The unique ID of this AuthNFT
        pub let authID: UInt64

        init() {
            self.authID = RegistryService.totalSupply

            RegistryService.totalSupply = RegistryService.totalSupply + (1 as UInt64)
        }
    }

    // register
    // register gets called by someone who has never registered with 
    // RegistryService before.
    //
    // It returns a AuthNFT.
    //
    pub fun register(): @AuthNFT {
        return <- create AuthNFT()
    }

    // Named Paths
    //
    pub let AuthStoragePath: StoragePath
    pub let AuthPublicPath: PublicPath

    init() {
        self.totalSupply = 0

        self.AuthStoragePath = /storage/RegistryServiceAuthNFT
        self.AuthPublicPath = /public/RegistryServiceAuthNFT
    }
}