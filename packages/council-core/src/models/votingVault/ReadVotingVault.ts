import { IVotingVault } from "@delvtech/council-artifacts/IVotingVault";
import { CachedReadContract } from "@delvtech/evm-client";
import { Model, ReadContractModelOptions } from "src/models/Model";
import { ReadVoter } from "src/models/ReadVoter";
import { VotingVaultAbi } from "src/models/votingVault/types";
import { BlockLike } from "src/utils/blockToReadOptions";
import { getBlock } from "src/utils/getBlock";

/**
 * @category Models
 */
export interface ReadVotingVaultOptions extends ReadContractModelOptions {}

/**
 * A vault which stores voting power by address
 * @category Models
 */
export class ReadVotingVault extends Model {
  contract: CachedReadContract<VotingVaultAbi>;

  constructor({
    address,
    contractFactory,
    network,
    cache,
    namespace,
    name,
  }: ReadVotingVaultOptions) {
    super({ name, network, contractFactory });
    this.contract = contractFactory({
      abi: IVotingVault.abi,
      address,
      cache,
      namespace,
    });
  }

  get address(): `0x${string}` {
    return this.contract.address;
  }
  get namespace(): string | undefined {
    return this.contract.namespace;
  }

  /**
   * Get the usable voting power owned by a given address in this vault.
   * @param extraData - ABI encoded optional extra data used by some vaults,
   *   such as merkle proofs.
   */
  async getVotingPower({
    account,
    atBlock = "latest",
    extraData = "0x00",
  }: {
    account: ReadVoter | `0x${string}`;
    atBlock?: BlockLike;
    extraData?: `0x${string}`;
  }): Promise<bigint> {
    let blockNumber = atBlock;

    if (typeof blockNumber !== "bigint") {
      const block = await getBlock(this.network, blockNumber);
      if (block.blockNumber === null) {
        return 0n;
      }
      blockNumber = block.blockNumber;
    }

    return this.contract.simulateWrite("queryVotePower", {
      blockNumber,
      extraData,
      user: typeof account === "string" ? account : account.address,
    });
  }
}
