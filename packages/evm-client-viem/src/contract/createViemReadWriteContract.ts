import {
  friendlyToArray,
  ReadContract,
  ReadWriteContract,
} from "@council/evm-client";
import {
  createViemReadContract,
  CreateViemReadContractOptions,
} from "src/contract/createViemReadContract";
import { createSimulateContractParameters } from "src/contract/utils/createSimulateContractParameters";
import { Abi, WalletClient } from "viem";

export interface ViemReadWriteContractOptions<TAbi extends Abi = Abi>
  extends CreateViemReadContractOptions<TAbi> {
  walletClient: WalletClient;
  readContract?: ReadContract<TAbi>;
}

/**
 * A viem implementation of the ReadWriteContract interface.
 * @see https://viem.sh/
 */
export function createViemReadWriteContract<TAbi extends Abi = Abi>({
  abi,
  address,
  publicClient,
  walletClient,
  readContract = createViemReadContract({ abi, address, publicClient }),
}: ViemReadWriteContractOptions<TAbi>): ReadWriteContract<TAbi> {
  return {
    ...readContract,

    async getSignerAddress() {
      return walletClient.getAddresses().then(([address]) => address);
    },

    // override to get the account from the wallet client
    async simulateWrite(functionName, args, options) {
      const [account] = await walletClient.getAddresses();

      return super.simulateWrite(functionName, args, {
        from: account,
        ...options,
      });
    },

    async write(functionName, args, options) {
      const [account] = await walletClient.getAddresses();

      const arrayArgs = friendlyToArray({
        abi: abi,
        type: "function",
        name: functionName,
        kind: "inputs",
        value: args,
      });

      const { request } = await publicClient.simulateContract({
        abi: abi as Abi,
        address: address,
        functionName,
        args: arrayArgs,
        ...createSimulateContractParameters({
          ...options,
          from: options?.from ?? account,
        }),
      });

      return walletClient.writeContract(request);
    },
  };
}
