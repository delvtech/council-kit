import {
  IReadWriteContract,
  FunctionName,
  FunctionArgs,
  ContractWriteOptions,
  FunctionReturnType,
  ContractWriteOptionsWithCallback,
} from "@council/evm-client";
import {
  ViemReadContract,
  ViemReadContractOptions,
} from "src/contract/ViemReadContract";
import { createSimulateContractParameters } from "src/contract/utils/createSimulateContractParameters";
import { Abi, WalletClient } from "viem";

export interface ViemReadWriteContractOptions<TAbi extends Abi = Abi>
  extends ViemReadContractOptions<TAbi> {
  walletClient: WalletClient;
}

/**
 * A viem implementation of the ReadWriteContract interface.
 * @see https://viem.sh/
 */
export class ViemReadWriteContract<TAbi extends Abi = Abi>
  extends ViemReadContract<TAbi>
  implements IReadWriteContract<TAbi>
{
  protected readonly _walletClient: WalletClient;

  constructor({
    abi,
    address,
    publicClient,
    walletClient,
  }: ViemReadWriteContractOptions<TAbi>) {
    super({
      abi,
      address,
      publicClient,
    });
    this._walletClient = walletClient;
  }

  // override to get the account from the wallet client
  override async simulateWrite<
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    functionName: TFunctionName,
    args: FunctionArgs<TAbi>,
    options?: ContractWriteOptions,
  ): Promise<FunctionReturnType<TAbi>> {
    const [account] = await this._walletClient.getAddresses();

    return super.simulateWrite(functionName, args, {
      from: account,
      ...options,
    });
  }

  async write<
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    functionName: TFunctionName,
    args: FunctionArgs<TAbi, TFunctionName>,
    options?: ContractWriteOptionsWithCallback,
  ): Promise<FunctionReturnType<TAbi, TFunctionName>> {
    const [account] = await this._walletClient.getAddresses();

    const { request, result } = await this._publicClient.simulateContract({
      abi: this.abi as any,
      address: this.address,
      functionName,
      args: args as any,
      ...createSimulateContractParameters({
        ...options,
        from: options?.from ?? account,
      }),
    });
    const hash = await this._walletClient.writeContract(request);
    options?.onSubmitted?.(hash);
    await this._publicClient.waitForTransactionReceipt({ hash });

    // Viem is smart enough to unpack an array of length 1 (might have something
    // to do with the `components` field in the abi), but not all contract
    // methods return a single-value array. To handle this discrepancy we make
    // sure to always return an array.
    if (Array.isArray(result)) {
      return result as unknown as Promise<
        FunctionReturnType<TAbi, TFunctionName>
      >;
    }
    return [result] as unknown as Promise<
      FunctionReturnType<TAbi, TFunctionName>
    >;
  }
}
