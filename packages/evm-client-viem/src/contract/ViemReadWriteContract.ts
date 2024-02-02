import {
  ContractWriteOptions,
  friendlyToArray,
  FunctionArgs,
  FunctionName,
  FunctionReturn,
  ReadWriteContract,
} from "@council/evm-client";
import { createSimulateContractParameters } from "src/contract/utils/createSimulateContractParameters";
import {
  ViemReadContract,
  ViemReadContractOptions,
} from "src/contract/ViemReadContract";
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
  implements ReadWriteContract<TAbi>
{
  walletClient: WalletClient;

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
    this.walletClient = walletClient;
  }

  // override to get the account from the wallet client
  override async simulateWrite<
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    functionName: TFunctionName,
    args: FunctionArgs<TAbi, TFunctionName>,
    options?: ContractWriteOptions,
  ): Promise<FunctionReturn<TAbi, TFunctionName>> {
    const [account] = await this.walletClient.getAddresses();

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
    options?: ContractWriteOptions,
  ): Promise<`0x${string}`> {
    const [account] = await this.walletClient.getAddresses();

    const { request } = await this.publicClient.simulateContract({
      abi: this.abi as any,
      address: this.address,
      functionName,
      args: friendlyToArray({
        abi: this.abi as Abi,
        type: "function",
        name: functionName,
        kind: "inputs",
        value: args,
      }),
      ...createSimulateContractParameters({
        ...options,
        from: options?.from ?? account,
      }),
    });

    return this.walletClient.writeContract(request);
  }
}
