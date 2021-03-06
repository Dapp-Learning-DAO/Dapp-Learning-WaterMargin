// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class ClaimSuccess extends ethereum.Event {
  get params(): ClaimSuccess__Params {
    return new ClaimSuccess__Params(this);
  }
}

export class ClaimSuccess__Params {
  _event: ClaimSuccess;

  constructor(event: ClaimSuccess) {
    this._event = event;
  }

  get id(): Bytes {
    return this._event.parameters[0].value.toBytes();
  }

  get claimer(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get claimed_value(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get token_address(): Address {
    return this._event.parameters[3].value.toAddress();
  }
}

export class CreationSuccess extends ethereum.Event {
  get params(): CreationSuccess__Params {
    return new CreationSuccess__Params(this);
  }
}

export class CreationSuccess__Params {
  _event: CreationSuccess;

  constructor(event: CreationSuccess) {
    this._event = event;
  }

  get total(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get id(): Bytes {
    return this._event.parameters[1].value.toBytes();
  }

  get name(): string {
    return this._event.parameters[2].value.toString();
  }

  get message(): string {
    return this._event.parameters[3].value.toString();
  }

  get creator(): Address {
    return this._event.parameters[4].value.toAddress();
  }

  get creation_time(): BigInt {
    return this._event.parameters[5].value.toBigInt();
  }

  get token_address(): Address {
    return this._event.parameters[6].value.toAddress();
  }

  get number(): BigInt {
    return this._event.parameters[7].value.toBigInt();
  }

  get ifrandom(): boolean {
    return this._event.parameters[8].value.toBoolean();
  }

  get duration(): BigInt {
    return this._event.parameters[9].value.toBigInt();
  }
}

export class RefundSuccess extends ethereum.Event {
  get params(): RefundSuccess__Params {
    return new RefundSuccess__Params(this);
  }
}

export class RefundSuccess__Params {
  _event: RefundSuccess;

  constructor(event: RefundSuccess) {
    this._event = event;
  }

  get id(): Bytes {
    return this._event.parameters[0].value.toBytes();
  }

  get token_address(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get remaining_balance(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class HappyRedPacket__check_availabilityResult {
  value0: Address;
  value1: BigInt;
  value2: BigInt;
  value3: BigInt;
  value4: boolean;
  value5: BigInt;

  constructor(
    value0: Address,
    value1: BigInt,
    value2: BigInt,
    value3: BigInt,
    value4: boolean,
    value5: BigInt
  ) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
    this.value4 = value4;
    this.value5 = value5;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromAddress(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    map.set("value2", ethereum.Value.fromUnsignedBigInt(this.value2));
    map.set("value3", ethereum.Value.fromUnsignedBigInt(this.value3));
    map.set("value4", ethereum.Value.fromBoolean(this.value4));
    map.set("value5", ethereum.Value.fromUnsignedBigInt(this.value5));
    return map;
  }
}

export class HappyRedPacket extends ethereum.SmartContract {
  static bind(address: Address): HappyRedPacket {
    return new HappyRedPacket("HappyRedPacket", address);
  }

  check_availability(id: Bytes): HappyRedPacket__check_availabilityResult {
    let result = super.call(
      "check_availability",
      "check_availability(bytes32):(address,uint256,uint256,uint256,bool,uint256)",
      [ethereum.Value.fromFixedBytes(id)]
    );

    return new HappyRedPacket__check_availabilityResult(
      result[0].toAddress(),
      result[1].toBigInt(),
      result[2].toBigInt(),
      result[3].toBigInt(),
      result[4].toBoolean(),
      result[5].toBigInt()
    );
  }

  try_check_availability(
    id: Bytes
  ): ethereum.CallResult<HappyRedPacket__check_availabilityResult> {
    let result = super.tryCall(
      "check_availability",
      "check_availability(bytes32):(address,uint256,uint256,uint256,bool,uint256)",
      [ethereum.Value.fromFixedBytes(id)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new HappyRedPacket__check_availabilityResult(
        value[0].toAddress(),
        value[1].toBigInt(),
        value[2].toBigInt(),
        value[3].toBigInt(),
        value[4].toBoolean(),
        value[5].toBigInt()
      )
    );
  }

  claim(id: Bytes, proof: Array<Bytes>): BigInt {
    let result = super.call("claim", "claim(bytes32,bytes32[]):(uint256)", [
      ethereum.Value.fromFixedBytes(id),
      ethereum.Value.fromFixedBytesArray(proof)
    ]);

    return result[0].toBigInt();
  }

  try_claim(id: Bytes, proof: Array<Bytes>): ethereum.CallResult<BigInt> {
    let result = super.tryCall("claim", "claim(bytes32,bytes32[]):(uint256)", [
      ethereum.Value.fromFixedBytes(id),
      ethereum.Value.fromFixedBytesArray(proof)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }
}

export class ClaimCall extends ethereum.Call {
  get inputs(): ClaimCall__Inputs {
    return new ClaimCall__Inputs(this);
  }

  get outputs(): ClaimCall__Outputs {
    return new ClaimCall__Outputs(this);
  }
}

export class ClaimCall__Inputs {
  _call: ClaimCall;

  constructor(call: ClaimCall) {
    this._call = call;
  }

  get id(): Bytes {
    return this._call.inputValues[0].value.toBytes();
  }

  get proof(): Array<Bytes> {
    return this._call.inputValues[1].value.toBytesArray();
  }
}

export class ClaimCall__Outputs {
  _call: ClaimCall;

  constructor(call: ClaimCall) {
    this._call = call;
  }

  get claimed(): BigInt {
    return this._call.outputValues[0].value.toBigInt();
  }
}

export class Create_red_packetCall extends ethereum.Call {
  get inputs(): Create_red_packetCall__Inputs {
    return new Create_red_packetCall__Inputs(this);
  }

  get outputs(): Create_red_packetCall__Outputs {
    return new Create_red_packetCall__Outputs(this);
  }
}

export class Create_red_packetCall__Inputs {
  _call: Create_red_packetCall;

  constructor(call: Create_red_packetCall) {
    this._call = call;
  }

  get _merkleroot(): Bytes {
    return this._call.inputValues[0].value.toBytes();
  }

  get _number(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get _ifrandom(): boolean {
    return this._call.inputValues[2].value.toBoolean();
  }

  get _duration(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }

  get _seed(): Bytes {
    return this._call.inputValues[4].value.toBytes();
  }

  get _message(): string {
    return this._call.inputValues[5].value.toString();
  }

  get _name(): string {
    return this._call.inputValues[6].value.toString();
  }

  get _token_type(): BigInt {
    return this._call.inputValues[7].value.toBigInt();
  }

  get _token_addr(): Address {
    return this._call.inputValues[8].value.toAddress();
  }

  get _total_tokens(): BigInt {
    return this._call.inputValues[9].value.toBigInt();
  }
}

export class Create_red_packetCall__Outputs {
  _call: Create_red_packetCall;

  constructor(call: Create_red_packetCall) {
    this._call = call;
  }
}

export class InitializeCall extends ethereum.Call {
  get inputs(): InitializeCall__Inputs {
    return new InitializeCall__Inputs(this);
  }

  get outputs(): InitializeCall__Outputs {
    return new InitializeCall__Outputs(this);
  }
}

export class InitializeCall__Inputs {
  _call: InitializeCall;

  constructor(call: InitializeCall) {
    this._call = call;
  }
}

export class InitializeCall__Outputs {
  _call: InitializeCall;

  constructor(call: InitializeCall) {
    this._call = call;
  }
}

export class RefundCall extends ethereum.Call {
  get inputs(): RefundCall__Inputs {
    return new RefundCall__Inputs(this);
  }

  get outputs(): RefundCall__Outputs {
    return new RefundCall__Outputs(this);
  }
}

export class RefundCall__Inputs {
  _call: RefundCall;

  constructor(call: RefundCall) {
    this._call = call;
  }

  get id(): Bytes {
    return this._call.inputValues[0].value.toBytes();
  }
}

export class RefundCall__Outputs {
  _call: RefundCall;

  constructor(call: RefundCall) {
    this._call = call;
  }
}
