import {
  friendlyToArray,
  ReadContract,
  ReadWriteContract,
} from "@council/evm-client";
import { Abi } from "abitype";
import { Contract, InterfaceAbi, Provider, Signer } from "ethers";
import { createEthersReadContract } from "src/contract/createEthersReadContract";

export interface EthersReadWriteContractOptions<TAbi extends Abi = Abi> {
  address: `0x${string}`;
  abi: TAbi;
  provider: Provider;
  signer: Signer;
  ethersContract?: Contract;
  readContract?: ReadContract<TAbi>;
}

/**
 * An ethers.js implementation of the {@linkcode ReadWriteContract} interface.
 * @see https://ethers.org/
 */
export function createEthersReadWriteContract<TAbi extends Abi = Abi>({
  address,
  abi,
  provider,
  signer,
  ethersContract = new Contract(address, abi as InterfaceAbi, signer),
  readContract = createEthersReadContract({
    address,
    abi,
    provider,
    ethersContract,
  }),
}: EthersReadWriteContractOptions<TAbi>): ReadWriteContract<TAbi> {
  return {
    ...readContract,

    getSignerAddress() {
      return signer.getAddress() as Promise<`0x${string}`>;
    },

    async write(functionName, args, options) {
      const argsArray = friendlyToArray({
        abi: abi as Abi,
        type: "function",
        name: functionName,
        kind: "inputs",
        value: args,
      });

      const transaction = await ethersContract[functionName].send(
        ...argsArray,
        options,
      );
      return transaction.hash as `0x${string}`;
    },
  };
}
