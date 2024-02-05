import { createEthersNetwork } from "@council/evm-client-ethers";
import { ReadWriteCouncil } from "@delvtech/council-core";
import { Signer } from "ethers";
import { createEthersReadWriteContractFactory } from "src/contract/createEthersReadWriteContractFactory";
import { EthersReadCouncilOptions } from "./EthersReadCouncil";

export interface EthersReadWriteCouncilOptions
  extends EthersReadCouncilOptions {
  signer: Signer;
}

export class EthersReadWriteCouncil extends ReadWriteCouncil {
  constructor({
    provider,
    signer,
    cache,
    namespace,
  }: EthersReadWriteCouncilOptions) {
    super({
      name: namespace,
      network: createEthersNetwork(provider),
      contractFactory: createEthersReadWriteContractFactory({
        provider,
        signer,
        cache,
        namespace,
      }),
    });
  }
}
