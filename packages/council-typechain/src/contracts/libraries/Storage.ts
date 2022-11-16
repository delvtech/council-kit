/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../common";

export interface StorageInterface extends utils.Interface {
  functions: {
    "getPtr(string,string)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic: "getPtr" | "getPtr(string,string)",
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "getPtr",
    values: [PromiseOrValue<string>, PromiseOrValue<string>],
  ): string;
  encodeFunctionData(
    functionFragment: "getPtr(string,string)",
    values: [PromiseOrValue<string>, PromiseOrValue<string>],
  ): string;

  decodeFunctionResult(functionFragment: "getPtr", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getPtr(string,string)",
    data: BytesLike,
  ): Result;

  events: {};
}

export interface Storage extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: StorageInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined,
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>,
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>,
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    getPtr(
      typeString: PromiseOrValue<string>,
      name: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<[BigNumber]>;

    "getPtr(string,string)"(
      typeString: PromiseOrValue<string>,
      name: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<[BigNumber]>;
  };

  getPtr(
    typeString: PromiseOrValue<string>,
    name: PromiseOrValue<string>,
    overrides?: CallOverrides,
  ): Promise<BigNumber>;

  "getPtr(string,string)"(
    typeString: PromiseOrValue<string>,
    name: PromiseOrValue<string>,
    overrides?: CallOverrides,
  ): Promise<BigNumber>;

  callStatic: {
    getPtr(
      typeString: PromiseOrValue<string>,
      name: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    "getPtr(string,string)"(
      typeString: PromiseOrValue<string>,
      name: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    getPtr(
      typeString: PromiseOrValue<string>,
      name: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    "getPtr(string,string)"(
      typeString: PromiseOrValue<string>,
      name: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    getPtr(
      typeString: PromiseOrValue<string>,
      name: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    "getPtr(string,string)"(
      typeString: PromiseOrValue<string>,
      name: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;
  };
}
