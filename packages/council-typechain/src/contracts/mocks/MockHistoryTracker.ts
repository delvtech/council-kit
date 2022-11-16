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
} from "../../common";

export interface MockHistoryTrackerInterface extends utils.Interface {
  functions: {
    "clear(uint256)": FunctionFragment;
    "find(uint256)": FunctionFragment;
    "findAndClear(uint256,uint256)": FunctionFragment;
    "loadBounds()": FunctionFragment;
    "loadTop()": FunctionFragment;
    "multiPush(uint256[])": FunctionFragment;
    "peekArrayData(uint256,uint256)": FunctionFragment;
    "push(uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "clear"
      | "clear(uint256)"
      | "find"
      | "find(uint256)"
      | "findAndClear"
      | "findAndClear(uint256,uint256)"
      | "loadBounds"
      | "loadBounds()"
      | "loadTop"
      | "loadTop()"
      | "multiPush"
      | "multiPush(uint256[])"
      | "peekArrayData"
      | "peekArrayData(uint256,uint256)"
      | "push"
      | "push(uint256)",
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "clear",
    values: [PromiseOrValue<BigNumberish>],
  ): string;
  encodeFunctionData(
    functionFragment: "clear(uint256)",
    values: [PromiseOrValue<BigNumberish>],
  ): string;
  encodeFunctionData(
    functionFragment: "find",
    values: [PromiseOrValue<BigNumberish>],
  ): string;
  encodeFunctionData(
    functionFragment: "find(uint256)",
    values: [PromiseOrValue<BigNumberish>],
  ): string;
  encodeFunctionData(
    functionFragment: "findAndClear",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>],
  ): string;
  encodeFunctionData(
    functionFragment: "findAndClear(uint256,uint256)",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>],
  ): string;
  encodeFunctionData(
    functionFragment: "loadBounds",
    values?: undefined,
  ): string;
  encodeFunctionData(
    functionFragment: "loadBounds()",
    values?: undefined,
  ): string;
  encodeFunctionData(functionFragment: "loadTop", values?: undefined): string;
  encodeFunctionData(functionFragment: "loadTop()", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "multiPush",
    values: [PromiseOrValue<BigNumberish>[]],
  ): string;
  encodeFunctionData(
    functionFragment: "multiPush(uint256[])",
    values: [PromiseOrValue<BigNumberish>[]],
  ): string;
  encodeFunctionData(
    functionFragment: "peekArrayData",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>],
  ): string;
  encodeFunctionData(
    functionFragment: "peekArrayData(uint256,uint256)",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>],
  ): string;
  encodeFunctionData(
    functionFragment: "push",
    values: [PromiseOrValue<BigNumberish>],
  ): string;
  encodeFunctionData(
    functionFragment: "push(uint256)",
    values: [PromiseOrValue<BigNumberish>],
  ): string;

  decodeFunctionResult(functionFragment: "clear", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "clear(uint256)",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(functionFragment: "find", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "find(uint256)",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: "findAndClear",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: "findAndClear(uint256,uint256)",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(functionFragment: "loadBounds", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "loadBounds()",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(functionFragment: "loadTop", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "loadTop()", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "multiPush", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "multiPush(uint256[])",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: "peekArrayData",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: "peekArrayData(uint256,uint256)",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(functionFragment: "push", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "push(uint256)",
    data: BytesLike,
  ): Result;

  events: {};
}

export interface MockHistoryTracker extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: MockHistoryTrackerInterface;

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
    clear(
      newMin: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    "clear(uint256)"(
      newMin: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    find(
      which: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<[BigNumber]>;

    "find(uint256)"(
      which: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<[BigNumber]>;

    findAndClear(
      which: PromiseOrValue<BigNumberish>,
      stale: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    "findAndClear(uint256,uint256)"(
      which: PromiseOrValue<BigNumberish>,
      stale: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    loadBounds(overrides?: CallOverrides): Promise<[BigNumber, BigNumber]>;

    "loadBounds()"(overrides?: CallOverrides): Promise<[BigNumber, BigNumber]>;

    loadTop(overrides?: CallOverrides): Promise<[BigNumber]>;

    "loadTop()"(overrides?: CallOverrides): Promise<[BigNumber]>;

    multiPush(
      toBePushed: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    "multiPush(uint256[])"(
      toBePushed: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    peekArrayData(
      start: PromiseOrValue<BigNumberish>,
      end: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<[BigNumber[], BigNumber[]]>;

    "peekArrayData(uint256,uint256)"(
      start: PromiseOrValue<BigNumberish>,
      end: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<[BigNumber[], BigNumber[]]>;

    push(
      data: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    "push(uint256)"(
      data: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;
  };

  clear(
    newMin: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  "clear(uint256)"(
    newMin: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  find(
    which: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides,
  ): Promise<BigNumber>;

  "find(uint256)"(
    which: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides,
  ): Promise<BigNumber>;

  findAndClear(
    which: PromiseOrValue<BigNumberish>,
    stale: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  "findAndClear(uint256,uint256)"(
    which: PromiseOrValue<BigNumberish>,
    stale: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  loadBounds(overrides?: CallOverrides): Promise<[BigNumber, BigNumber]>;

  "loadBounds()"(overrides?: CallOverrides): Promise<[BigNumber, BigNumber]>;

  loadTop(overrides?: CallOverrides): Promise<BigNumber>;

  "loadTop()"(overrides?: CallOverrides): Promise<BigNumber>;

  multiPush(
    toBePushed: PromiseOrValue<BigNumberish>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  "multiPush(uint256[])"(
    toBePushed: PromiseOrValue<BigNumberish>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  peekArrayData(
    start: PromiseOrValue<BigNumberish>,
    end: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides,
  ): Promise<[BigNumber[], BigNumber[]]>;

  "peekArrayData(uint256,uint256)"(
    start: PromiseOrValue<BigNumberish>,
    end: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides,
  ): Promise<[BigNumber[], BigNumber[]]>;

  push(
    data: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  "push(uint256)"(
    data: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  callStatic: {
    clear(
      newMin: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<void>;

    "clear(uint256)"(
      newMin: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<void>;

    find(
      which: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    "find(uint256)"(
      which: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    findAndClear(
      which: PromiseOrValue<BigNumberish>,
      stale: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    "findAndClear(uint256,uint256)"(
      which: PromiseOrValue<BigNumberish>,
      stale: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    loadBounds(overrides?: CallOverrides): Promise<[BigNumber, BigNumber]>;

    "loadBounds()"(overrides?: CallOverrides): Promise<[BigNumber, BigNumber]>;

    loadTop(overrides?: CallOverrides): Promise<BigNumber>;

    "loadTop()"(overrides?: CallOverrides): Promise<BigNumber>;

    multiPush(
      toBePushed: PromiseOrValue<BigNumberish>[],
      overrides?: CallOverrides,
    ): Promise<void>;

    "multiPush(uint256[])"(
      toBePushed: PromiseOrValue<BigNumberish>[],
      overrides?: CallOverrides,
    ): Promise<void>;

    peekArrayData(
      start: PromiseOrValue<BigNumberish>,
      end: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<[BigNumber[], BigNumber[]]>;

    "peekArrayData(uint256,uint256)"(
      start: PromiseOrValue<BigNumberish>,
      end: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<[BigNumber[], BigNumber[]]>;

    push(
      data: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<void>;

    "push(uint256)"(
      data: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    clear(
      newMin: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    "clear(uint256)"(
      newMin: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    find(
      which: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    "find(uint256)"(
      which: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    findAndClear(
      which: PromiseOrValue<BigNumberish>,
      stale: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    "findAndClear(uint256,uint256)"(
      which: PromiseOrValue<BigNumberish>,
      stale: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    loadBounds(overrides?: CallOverrides): Promise<BigNumber>;

    "loadBounds()"(overrides?: CallOverrides): Promise<BigNumber>;

    loadTop(overrides?: CallOverrides): Promise<BigNumber>;

    "loadTop()"(overrides?: CallOverrides): Promise<BigNumber>;

    multiPush(
      toBePushed: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    "multiPush(uint256[])"(
      toBePushed: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    peekArrayData(
      start: PromiseOrValue<BigNumberish>,
      end: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    "peekArrayData(uint256,uint256)"(
      start: PromiseOrValue<BigNumberish>,
      end: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    push(
      data: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    "push(uint256)"(
      data: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    clear(
      newMin: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    "clear(uint256)"(
      newMin: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    find(
      which: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    "find(uint256)"(
      which: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    findAndClear(
      which: PromiseOrValue<BigNumberish>,
      stale: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    "findAndClear(uint256,uint256)"(
      which: PromiseOrValue<BigNumberish>,
      stale: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    loadBounds(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "loadBounds()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    loadTop(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "loadTop()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    multiPush(
      toBePushed: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    "multiPush(uint256[])"(
      toBePushed: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    peekArrayData(
      start: PromiseOrValue<BigNumberish>,
      end: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    "peekArrayData(uint256,uint256)"(
      start: PromiseOrValue<BigNumberish>,
      end: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    push(
      data: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    "push(uint256)"(
      data: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;
  };
}
