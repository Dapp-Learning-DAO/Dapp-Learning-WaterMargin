import { BigInt, Address } from "@graphprotocol/graph-ts";
import {
  Approval,
  ApprovalForAll,
  Transfer
} from "../generated/DappLearningCollectible/DappLearningCollectible"
import { DappLearningCollectible } from "../generated/schema"

export function handleApproval(event: Approval): void {
}

export function handleApprovalForAll(event: ApprovalForAll): void {}

export function handleTransfer(event: Transfer): void {
  let zeroAddr = Address.fromHexString("0x0000000000000000000000000000000000000000");
  let auctionAddr = Address.fromHexString("0x694ba869F610B723112c172f81E43222c68dAB91");

  let id = event.params.tokenId.toHex();
  let to = event.params.to;
  let tokenId =  event.params.tokenId; 
  let dappLearningCollectible = DappLearningCollectible.load(id);
  if (dappLearningCollectible == null) {
    dappLearningCollectible = new DappLearningCollectible(id);
    dappLearningCollectible.tokenId = tokenId;
  }

  if ( to == zeroAddr ){
    dappLearningCollectible.isBurn = true;
  }else{
    dappLearningCollectible.isBurn = false;
  }
  
  if( to == auctionAddr ){
    dappLearningCollectible.isAuction = true;
  }else{
    dappLearningCollectible.isAuction = false;
  }

  dappLearningCollectible.owner = to;

  dappLearningCollectible.save(); 
}
