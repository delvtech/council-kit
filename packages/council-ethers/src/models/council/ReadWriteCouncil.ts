import { ReadWriteCouncil as BaseReadWriteCouncil } from "@delvtech/council-core";
import { createNetwork } from "@delvtech/evm-client-ethers";
import { Signer } from "ethers";
import { createReadWriteContractFactory } from "src/contract/createReadWriteContractFactory";
import { ReadCouncilOptions } from "./ReadCouncil";

export interface ReadWriteCouncilOptions extends ReadCouncilOptions {
  signer: Signer;
}

export class ReadWriteCouncil extends BaseReadWriteCouncil {
  constructor({ provider, signer, cache, namespace }: ReadWriteCouncilOptions) {
    super({
      name: namespace,
      network: createNetwork(provider),
      contractFactory: createReadWriteContractFactory({
        provider,
        signer,
        cache,
        namespace,
      }),
    });
  }
}
