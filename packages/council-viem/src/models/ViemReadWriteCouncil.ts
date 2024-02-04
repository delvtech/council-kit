import { ViemNetwork } from "@council/evm-client-viem";
import { ReadWriteCouncil } from "@delvtech/council-core";
import { createViemReadWriteContractFactory } from "src/contract/createViemReadWriteContractFactory";
import { WalletClient } from "viem";
import { ViemReadCouncilOptions } from "./ViemReadCouncil";

export interface ViemReadWriteCouncilOptions extends ViemReadCouncilOptions {
  walletClient: WalletClient;
}

export class ViemReadWriteCouncil extends ReadWriteCouncil {
  constructor({
    publicClient,
    walletClient,
    cache,
    namespace,
  }: ViemReadWriteCouncilOptions) {
    super({
      name: namespace,
      network: new ViemNetwork(publicClient),
      contractFactory: createViemReadWriteContractFactory({
        publicClient,
        walletClient,
        cache,
        namespace,
      }),
    });
  }
}
