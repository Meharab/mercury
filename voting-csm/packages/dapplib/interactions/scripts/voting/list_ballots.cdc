
import RegistryVotingContract from Project.RegistryVotingContract

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