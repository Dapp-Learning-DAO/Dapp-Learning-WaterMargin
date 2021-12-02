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

export { dappLearningCollectibles, getCurrentColl };