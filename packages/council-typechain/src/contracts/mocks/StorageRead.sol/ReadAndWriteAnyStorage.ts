/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
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
} from "../../../common";

export interface ReadAndWriteAnyStorageInterface extends utils.Interface {
  functions: {
    "readStorage(uint256)": FunctionFragment;
    "writeStorage(uint256,bytes32)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "readStorage"
      | "readStorage(uint256)"
      | "writeStorage"
      | "writeStorage(uint256,bytes32)",
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "readStorage",
    values: [PromiseOrValue<BigNumberish>],
  ): string;
  encodeFunctionData(
    functionFragment: "readStorage(uint256)",
    values: [PromiseOrValue<BigNumberish>],
  ): string;
  encodeFunctionData(
    functionFragment: "writeStorage",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BytesLike>],
  ): string;
  encodeFunctionData(
    functionFragment: "writeStorage(uint256,bytes32)",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BytesLike>],
  ): string;

  decodeFunctionResult(
    functionFragment: "readStorage",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: "readStorage(uint256)",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: "writeStorage",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: "writeStorage(uint256,bytes32)",
    data: BytesLike,
  ): Result;

  events: {};
}

export interface ReadAndWriteAnyStorage extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ReadAndWriteAnyStorageInterface;

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
    readStorage(
      slot: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<[string] & { data: string }>;

    "readStorage(uint256)"(
      slot: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<[string] & { data: string }>;

    writeStorage(
      slot: PromiseOrValue<BigNumberish>,
      data: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    "writeStorage(uint256,bytes32)"(
      slot: PromiseOrValue<BigNumberish>,
      data: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;
  };

  readStorage(
    slot: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides,
  ): Promise<string>;

  "readStorage(uint256)"(
    slot: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides,
  ): Promise<string>;

  writeStorage(
    slot: PromiseOrValue<BigNumberish>,
    data: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  "writeStorage(uint256,bytes32)"(
    slot: PromiseOrValue<BigNumberish>,
    data: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  callStatic: {
    readStorage(
      slot: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<string>;

    "readStorage(uint256)"(
      slot: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<string>;

    writeStorage(
      slot: PromiseOrValue<BigNumberish>,
      data: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides,
    ): Promise<void>;

    "writeStorage(uint256,bytes32)"(
      slot: PromiseOrValue<BigNumberish>,
      data: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides,
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    readStorage(
      slot: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    "readStorage(uint256)"(
      slot: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    writeStorage(
      slot: PromiseOrValue<BigNumberish>,
      data: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    "writeStorage(uint256,bytes32)"(
      slot: PromiseOrValue<BigNumberish>,
      data: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    readStorage(
      slot: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    "readStorage(uint256)"(
      slot: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    writeStorage(
      slot: PromiseOrValue<BigNumberish>,
      data: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    "writeStorage(uint256,bytes32)"(
      slot: PromiseOrValue<BigNumberish>,
      data: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;
  };
}
