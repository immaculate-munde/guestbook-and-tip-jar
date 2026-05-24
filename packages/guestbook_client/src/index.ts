import { Buffer } from "buffer";
import { Address } from "@stellar/stellar-sdk";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract";
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Timepoint,
  Duration,
} from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}




export type DataKey = {tag: "Admin", values: void} | {tag: "TipToken", values: void} | {tag: "MessageCount", values: void} | {tag: "Message", values: readonly [u32]};


export interface Message {
  author: string;
  ledger: u32;
  text: string;
  tip_amount: i128;
}

export interface Client {
  /**
   * Construct and simulate a get_messages transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Return all guestbook messages in chronological order.
   */
  get_messages: (options?: MethodOptions) => Promise<AssembledTransaction<Array<Message>>>

  /**
   * Construct and simulate a sign_guestbook transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Sign the guestbook with an optional tip in stroops (7 decimals for XLM).
   */
  sign_guestbook: ({user, message, tip_amount}: {user: string, message: string, tip_amount: i128}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
        /** Constructor/Initialization Args for the contract's `__constructor` method */
        {admin, tip_token}: {admin: string, tip_token: string},
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy({admin, tip_token}, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABAAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAAIVGlwVG9rZW4AAAAAAAAAAAAAAAxNZXNzYWdlQ291bnQAAAABAAAAAAAAAAdNZXNzYWdlAAAAAAEAAAAE",
        "AAAAAQAAAAAAAAAAAAAAB01lc3NhZ2UAAAAABAAAAAAAAAAGYXV0aG9yAAAAAAATAAAAAAAAAAZsZWRnZXIAAAAAAAQAAAAAAAAABHRleHQAAAAQAAAAAAAAAAp0aXBfYW1vdW50AAAAAAAL",
        "AAAAAAAAADVSZXR1cm4gYWxsIGd1ZXN0Ym9vayBtZXNzYWdlcyBpbiBjaHJvbm9sb2dpY2FsIG9yZGVyLgAAAAAAAAxnZXRfbWVzc2FnZXMAAAAAAAAAAQAAA+oAAAfQAAAAB01lc3NhZ2UA",
        "AAAAAAAAAFpTdG9yZXMgdGhlIHRpcCByZWNpcGllbnQgYW5kIHRoZSB0b2tlbiBjb250cmFjdCB1c2VkIGZvciB0aXBzIChuYXRpdmUgWExNIFNBQyBvbiB0ZXN0bmV0KS4AAAAAAA1fX2NvbnN0cnVjdG9yAAAAAAAAAgAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAAl0aXBfdG9rZW4AAAAAAAATAAAAAA==",
        "AAAAAAAAAEhTaWduIHRoZSBndWVzdGJvb2sgd2l0aCBhbiBvcHRpb25hbCB0aXAgaW4gc3Ryb29wcyAoNyBkZWNpbWFscyBmb3IgWExNKS4AAAAOc2lnbl9ndWVzdGJvb2sAAAAAAAMAAAAAAAAABHVzZXIAAAATAAAAAAAAAAdtZXNzYWdlAAAAABAAAAAAAAAACnRpcF9hbW91bnQAAAAAAAsAAAAA" ]),
      options
    )
  }
  public readonly fromJSON = {
    get_messages: this.txFromJSON<Array<Message>>,
        sign_guestbook: this.txFromJSON<null>
  }
}