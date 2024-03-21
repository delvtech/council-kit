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
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../../common";

export interface AbstractLockingVaultInterface extends utils.Interface {
  functions: {
    "changeDelegation(address)": FunctionFragment;
    "deposit(address,uint256,address)": FunctionFragment;
    "deposits(address)": FunctionFragment;
    "queryVotePower(address,uint256,bytes)": FunctionFragment;
    "queryVotePowerView(address,uint256)": FunctionFragment;
    "staleBlockLag()": FunctionFragment;
    "token()": FunctionFragment;
    "withdraw(uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "changeDelegation"
      | "changeDelegation(address)"
      | "deposit"
      | "deposit(address,uint256,address)"
      | "deposits"
      | "deposits(address)"
      | "queryVotePower"
      | "queryVotePower(address,uint256,bytes)"
      | "queryVotePowerView"
      | "queryVotePowerView(address,uint256)"
      | "staleBlockLag"
      | "staleBlockLag()"
      | "token"
      | "token()"
      | "withdraw"
      | "withdraw(uint256)",
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "changeDelegation",
    values: [PromiseOrValue<string>],
  ): string;
  encodeFunctionData(
    functionFragment: "changeDelegation(address)",
    values: [PromiseOrValue<string>],
  ): string;
  encodeFunctionData(
    functionFragment: "deposit",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
    ],
  ): string;
  encodeFunctionData(
    functionFragment: "deposit(address,uint256,address)",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
    ],
  ): string;
  encodeFunctionData(
    functionFragment: "deposits",
    values: [PromiseOrValue<string>],
  ): string;
  encodeFunctionData(
    functionFragment: "deposits(address)",
    values: [PromiseOrValue<string>],
  ): string;
  encodeFunctionData(
    functionFragment: "queryVotePower",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BytesLike>,
    ],
  ): string;
  encodeFunctionData(
    functionFragment: "queryVotePower(address,uint256,bytes)",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BytesLike>,
    ],
  ): string;
  encodeFunctionData(
    functionFragment: "queryVotePowerView",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>],
  ): string;
  encodeFunctionData(
    functionFragment: "queryVotePowerView(address,uint256)",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>],
  ): string;
  encodeFunctionData(
    functionFragment: "staleBlockLag",
    values?: undefined,
  ): string;
  encodeFunctionData(
    functionFragment: "staleBlockLag()",
    values?: undefined,
  ): string;
  encodeFunctionData(functionFragment: "token", values?: undefined): string;
  encodeFunctionData(functionFragment: "token()", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "withdraw",
    values: [PromiseOrValue<BigNumberish>],
  ): string;
  encodeFunctionData(
    functionFragment: "withdraw(uint256)",
    values: [PromiseOrValue<BigNumberish>],
  ): string;

  decodeFunctionResult(
    functionFragment: "changeDelegation",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: "changeDelegation(address)",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(functionFragment: "deposit", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "deposit(address,uint256,address)",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(functionFragment: "deposits", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "deposits(address)",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: "queryVotePower",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: "queryVotePower(address,uint256,bytes)",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: "queryVotePowerView",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: "queryVotePowerView(address,uint256)",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: "staleBlockLag",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: "staleBlockLag()",
    data: BytesLike,
  ): Result;
  decodeFunctionResult(functionFragment: "token", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "token()", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "withdraw(uint256)",
    data: BytesLike,
  ): Result;

  events: {
    "VoteChange(address,address,int256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "VoteChange"): EventFragment;
  getEvent(
    nameOrSignatureOrTopic: "VoteChange(address,address,int256)",
  ): EventFragment;
}

export interface VoteChangeEventObject {
  from: string;
  to: string;
  amount: BigNumber;
}
export type VoteChangeEvent = TypedEvent<
  [string, string, BigNumber],
  VoteChangeEventObject
>;

export type VoteChangeEventFilter = TypedEventFilter<VoteChangeEvent>;

export interface AbstractLockingVault extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: AbstractLockingVaultInterface;

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
    changeDelegation(
      newDelegate: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    "changeDelegation(address)"(
      newDelegate: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    deposit(
      fundedAccount: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      firstDelegation: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    "deposit(address,uint256,address)"(
      fundedAccount: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      firstDelegation: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    deposits(
      who: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<[string, BigNumber]>;

    "deposits(address)"(
      who: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<[string, BigNumber]>;

    queryVotePower(
      user: PromiseOrValue<string>,
      blockNumber: PromiseOrValue<BigNumberish>,
      arg2: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    "queryVotePower(address,uint256,bytes)"(
      user: PromiseOrValue<string>,
      blockNumber: PromiseOrValue<BigNumberish>,
      arg2: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    queryVotePowerView(
      user: PromiseOrValue<string>,
      blockNumber: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<[BigNumber]>;

    "queryVotePowerView(address,uint256)"(
      user: PromiseOrValue<string>,
      blockNumber: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<[BigNumber]>;

    staleBlockLag(overrides?: CallOverrides): Promise<[BigNumber]>;

    "staleBlockLag()"(overrides?: CallOverrides): Promise<[BigNumber]>;

    token(overrides?: CallOverrides): Promise<[string]>;

    "token()"(overrides?: CallOverrides): Promise<[string]>;

    withdraw(
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    "withdraw(uint256)"(
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;
  };

  changeDelegation(
    newDelegate: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  "changeDelegation(address)"(
    newDelegate: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  deposit(
    fundedAccount: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    firstDelegation: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  "deposit(address,uint256,address)"(
    fundedAccount: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    firstDelegation: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  deposits(
    who: PromiseOrValue<string>,
    overrides?: CallOverrides,
  ): Promise<[string, BigNumber]>;

  "deposits(address)"(
    who: PromiseOrValue<string>,
    overrides?: CallOverrides,
  ): Promise<[string, BigNumber]>;

  queryVotePower(
    user: PromiseOrValue<string>,
    blockNumber: PromiseOrValue<BigNumberish>,
    arg2: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  "queryVotePower(address,uint256,bytes)"(
    user: PromiseOrValue<string>,
    blockNumber: PromiseOrValue<BigNumberish>,
    arg2: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  queryVotePowerView(
    user: PromiseOrValue<string>,
    blockNumber: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides,
  ): Promise<BigNumber>;

  "queryVotePowerView(address,uint256)"(
    user: PromiseOrValue<string>,
    blockNumber: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides,
  ): Promise<BigNumber>;

  staleBlockLag(overrides?: CallOverrides): Promise<BigNumber>;

  "staleBlockLag()"(overrides?: CallOverrides): Promise<BigNumber>;

  token(overrides?: CallOverrides): Promise<string>;

  "token()"(overrides?: CallOverrides): Promise<string>;

  withdraw(
    amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  "withdraw(uint256)"(
    amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  callStatic: {
    changeDelegation(
      newDelegate: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<void>;

    "changeDelegation(address)"(
      newDelegate: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<void>;

    deposit(
      fundedAccount: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      firstDelegation: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<void>;

    "deposit(address,uint256,address)"(
      fundedAccount: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      firstDelegation: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<void>;

    deposits(
      who: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<[string, BigNumber]>;

    "deposits(address)"(
      who: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<[string, BigNumber]>;

    queryVotePower(
      user: PromiseOrValue<string>,
      blockNumber: PromiseOrValue<BigNumberish>,
      arg2: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    "queryVotePower(address,uint256,bytes)"(
      user: PromiseOrValue<string>,
      blockNumber: PromiseOrValue<BigNumberish>,
      arg2: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    queryVotePowerView(
      user: PromiseOrValue<string>,
      blockNumber: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    "queryVotePowerView(address,uint256)"(
      user: PromiseOrValue<string>,
      blockNumber: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    staleBlockLag(overrides?: CallOverrides): Promise<BigNumber>;

    "staleBlockLag()"(overrides?: CallOverrides): Promise<BigNumber>;

    token(overrides?: CallOverrides): Promise<string>;

    "token()"(overrides?: CallOverrides): Promise<string>;

    withdraw(
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<void>;

    "withdraw(uint256)"(
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<void>;
  };

  filters: {
    "VoteChange(address,address,int256)"(
      from?: PromiseOrValue<string> | null,
      to?: PromiseOrValue<string> | null,
      amount?: null,
    ): VoteChangeEventFilter;
    VoteChange(
      from?: PromiseOrValue<string> | null,
      to?: PromiseOrValue<string> | null,
      amount?: null,
    ): VoteChangeEventFilter;
  };

  estimateGas: {
    changeDelegation(
      newDelegate: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    "changeDelegation(address)"(
      newDelegate: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    deposit(
      fundedAccount: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      firstDelegation: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    "deposit(address,uint256,address)"(
      fundedAccount: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      firstDelegation: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    deposits(
      who: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    "deposits(address)"(
      who: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    queryVotePower(
      user: PromiseOrValue<string>,
      blockNumber: PromiseOrValue<BigNumberish>,
      arg2: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    "queryVotePower(address,uint256,bytes)"(
      user: PromiseOrValue<string>,
      blockNumber: PromiseOrValue<BigNumberish>,
      arg2: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    queryVotePowerView(
      user: PromiseOrValue<string>,
      blockNumber: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    "queryVotePowerView(address,uint256)"(
      user: PromiseOrValue<string>,
      blockNumber: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    staleBlockLag(overrides?: CallOverrides): Promise<BigNumber>;

    "staleBlockLag()"(overrides?: CallOverrides): Promise<BigNumber>;

    token(overrides?: CallOverrides): Promise<BigNumber>;

    "token()"(overrides?: CallOverrides): Promise<BigNumber>;

    withdraw(
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    "withdraw(uint256)"(
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    changeDelegation(
      newDelegate: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    "changeDelegation(address)"(
      newDelegate: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    deposit(
      fundedAccount: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      firstDelegation: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    "deposit(address,uint256,address)"(
      fundedAccount: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      firstDelegation: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    deposits(
      who: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    "deposits(address)"(
      who: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    queryVotePower(
      user: PromiseOrValue<string>,
      blockNumber: PromiseOrValue<BigNumberish>,
      arg2: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    "queryVotePower(address,uint256,bytes)"(
      user: PromiseOrValue<string>,
      blockNumber: PromiseOrValue<BigNumberish>,
      arg2: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    queryVotePowerView(
      user: PromiseOrValue<string>,
      blockNumber: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    "queryVotePowerView(address,uint256)"(
      user: PromiseOrValue<string>,
      blockNumber: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    staleBlockLag(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "staleBlockLag()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    token(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "token()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    withdraw(
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    "withdraw(uint256)"(
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;
  };
}