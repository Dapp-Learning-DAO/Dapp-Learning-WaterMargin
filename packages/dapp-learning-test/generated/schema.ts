// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Address,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class DappLearningCollectible extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(
      id !== null,
      "Cannot save DappLearningCollectible entity without an ID"
    );
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save DappLearningCollectible entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("DappLearningCollectible", id.toString(), this);
  }

  static load(id: string): DappLearningCollectible | null {
    return store.get(
      "DappLearningCollectible",
      id
    ) as DappLearningCollectible | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get tokenId(): BigInt {
    let value = this.get("tokenId");
    return value.toBigInt();
  }

  set tokenId(value: BigInt) {
    this.set("tokenId", Value.fromBigInt(value));
  }

  get owner(): Bytes {
    let value = this.get("owner");
    return value.toBytes();
  }

  set owner(value: Bytes) {
    this.set("owner", Value.fromBytes(value));
  }

  get isBurn(): boolean {
    let value = this.get("isBurn");
    return value.toBoolean();
  }

  set isBurn(value: boolean) {
    this.set("isBurn", Value.fromBoolean(value));
  }

  get isAuction(): boolean {
    let value = this.get("isAuction");
    return value.toBoolean();
  }

  set isAuction(value: boolean) {
    this.set("isAuction", Value.fromBoolean(value));
  }
}
