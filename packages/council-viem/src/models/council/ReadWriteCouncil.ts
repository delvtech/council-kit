import { createNetwork } from "@council/evm-client-viem";
import { ReadWriteCouncil as BaseReadWriteCouncil } from "@delvtech/council-core";
import { createReadWriteContractFactory } from "src/contract/createReadWriteContractFactory";
import { ReadCouncilOptions } from "src/models/council/ReadCouncil";
import { WalletClient } from "viem";

export interface ReadWriteCouncilOptions extends ReadCouncilOptions {
  walletClient: WalletClient;
}

export class ReadWriteCouncil extends BaseReadWriteCouncil {
  constructor({
    publicClient,
    walletClient,
    cache,
    namespace,
  }: ReadWriteCouncilOptions) {
    super({
      name: namespace,
      network: createNetwork(publicClient),
      contractFactory: createReadWriteContractFactory({
        publicClient,
        walletClient,
        cache,
        namespace,
      }),
    });
  }
}
