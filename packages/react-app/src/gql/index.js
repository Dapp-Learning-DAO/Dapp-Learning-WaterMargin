import { gql, useQuery } from "@apollo/client";

const dappLearningCollectibles = gql`
    {
      dappLearningCollectibles(first: 108) {
        id
        tokenId
        owner
        isBurn
        isAuction
      }
    }
  `;

const getCurrentColl = gql`
  query getCurrent($address:Bytes){
  
  dappLearningCollectibles(first: 108,where: { owner: $address  }) {
    id
    tokenId
    owner
    isBurn
  }
}
`

const happyRedPacketsGraph = gql`
    {
      happyRedPackets(first: 5) {
        id
        claimers {
          id
          user
          amount
        }
      }
    }
  `;

export { dappLearningCollectibles, getCurrentColl, happyRedPacketsGraph };