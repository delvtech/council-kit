import { ContractWriteOptions } from "@delvtech/evm-client";

import { BALLOTS } from "src/models/coreVoting/constants";
import { ReadWriteCoreVoting } from "src/models/coreVoting/ReadWriteCoreVoting";
import { Ballot } from "src/models/coreVoting/types";
import { ReadWriteModelOptions } from "src/models/Model";
import {
  BaseProposalOptions,
  ReadProposal,
} from "src/models/proposal/ReadProposal";
import { ReadVotingVault } from "src/models/votingVault/ReadVotingVault";
import { getVaultsWithPower } from "src/utils/getVaultsWithPower";

export interface ReadWriteProposalOptions
  extends ReadWriteModelOptions,
    BaseProposalOptions {
  coreVoting: ReadWriteCoreVoting | `0x${string}`;
}

export class ReadWriteProposal extends ReadProposal {
  declare coreVoting: ReadWriteCoreVoting;

  constructor(options: ReadWriteProposalOptions) {
    super(options);
  }

  /**
   * Execute a proposal.
   * @param signer - An ethers Signer instance.
   * @returns The transaction hash.
   */
  async execute({
    options,
  }: { options?: ContractWriteOptions } = {}): Promise<`0x${string}`> {
    const actions = await this.getTargetsAndCalldatas();
    if (!actions) {
      throw new Error("Proposal not found");
    }
    const hash = await this.coreVoting.contract.write(
      "execute",
      {
        calldatas: actions.calldatas,
        targets: actions.targets,
        proposalId: this.id,
      },
      options,
    );
    this.coreVoting.contract.clearCache();
    return hash;
  }

  /**
   * Vote on this proposal.
   * @param signer - An ethers Signer instance for the voter.
   * @param ballot - The ballot to cast.
   * @returns The transaction hash.
   */
  async vote({
    ballot,
    vaults: _vaults = this.coreVoting.vaults,
    extraVaultData: _extraVaultData,
    options,
  }: {
    ballot: Ballot;
    /**
     * The vaults to draw voting power from. Defaults to the `CoreVoting`'s
     * configured vaults.
     */
    vaults?: (`0x${string}` | ReadVotingVault)[];
    /**
     * Extra data given to the vaults to help calculation.
     */
    extraVaultData?: `0x${string}`[];
    options?: ContractWriteOptions;
  }): Promise<`0x${string}`> {
    const vaults = _vaults.map((vault) =>
      vault instanceof ReadVotingVault
        ? vault
        : new ReadVotingVault({
            address: vault,
            contractFactory: this.contractFactory,
            network: this.network,
          }),
    );

    const signerAddress = await this.coreVoting.contract.getSignerAddress();
    const vaultsWithPower = await getVaultsWithPower(signerAddress, vaults);

    const extraVaultData = vaultsWithPower.map(({ address }) => {
      const index = _vaults.indexOf(address);
      return _extraVaultData?.[index] || "0x";
    });

    const hash = this.coreVoting.contract.write(
      "vote",
      {
        ballot: BALLOTS.indexOf(ballot),
        extraVaultData,
        proposalId: this.id,
        votingVaults: vaultsWithPower.map(({ address }) => address),
      },
      options,
    );

    this.coreVoting.contract.clearCache();

    return hash;
  }
}
