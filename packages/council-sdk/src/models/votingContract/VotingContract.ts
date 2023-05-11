import { Signer } from "ethers";
import { BytesLike, parseEther } from "ethers/lib/utils";
import uniqBy from "lodash.uniqby";
import { CouncilContext } from "src/context/context";
import { TransactionOptions } from "src/datasources/base/contract/ContractDataSource";
import { CoreVotingContractDataSource } from "src/datasources/votingContract/CoreVotingContractDataSource";
import {
  Ballot,
  VotingContractDataSource,
} from "src/datasources/votingContract/VotingContractDataSource";
import { Model, ModelOptions } from "src/models/Model";
import { Proposal } from "src/models/Proposal";
import { Vote } from "src/models/Vote";
import { Voter } from "src/models/Voter";
import {
  VoterPowerBreakdown,
  VoterWithPower,
} from "src/models/votingVault/types";
import { VotingVault } from "src/models/votingVault/VotingVault";
import { sumStrings } from "src/utils/sumStrings";

/**
 * @category Models
 */
export interface VotingContractOptions extends ModelOptions {
  /**
   * A data source to use instead of registering one with the `context`. If you
   * pass in a data source, you take over the responsibility of registering it
   * with the `context` to make it available to other models and data sources.
   */
  dataSource?: VotingContractDataSource;
}

/**
 * A model of a CoreVoting contract.
 * @category Models
 */
export class VotingContract<
  TVaults extends VotingVault[] = VotingVault[],
> extends Model {
  address: string;
  dataSource: VotingContractDataSource;
  vaults: TVaults;

  /**
   * Create a new VotingContract model instance.
   * @param address - The address of the deployed contract.
   * @param vaults - The VotingVault instances or addresses of the vaults that are
   *   approved for this voting contract.
   */
  constructor(
    address: string,
    vaults: (VotingVault | string)[],
    context: CouncilContext,
    options?: VotingContractOptions,
  ) {
    super(context, {
      ...options,
      name: options?.name ?? "Core Voting",
    });
    this.address = address;
    this.vaults = vaults.map((vault) =>
      vault instanceof VotingVault
        ? vault
        : new VotingVault(vault, this.context),
    ) as TVaults;
    this.dataSource =
      options?.dataSource ||
      this.context.registerDataSource(
        { address },
        new CoreVotingContractDataSource(address, context),
      );
  }

  /**
   * Get a proposal by id.
   */
  getProposal(id: number): Proposal {
    return new Proposal(id, this, this.context);
  }

  /**
   * Get all proposals ever created.
   * @param fromBlock - Include all proposals created on or after this block number.
   * @param toBlock - Include all proposals created on or before this block number.
   */
  async getProposals(
    fromBlock?: number,
    toBlock?: number,
  ): Promise<Proposal[]> {
    const proposals = await this.dataSource.getProposals(fromBlock, toBlock);
    return proposals.map(({ id }) => new Proposal(id, this, this.context));
  }

  /**
   * Create a new proposal.
   * @param signer - An ethers Signer instance for the voter.
   * @param vaults - The addresses of the approved vaults to draw voting power
   *   from.
   * @param targets - The targets (contract addresses) to call.
   * @param calldatas - The execution calldata for each target.
   * @param lastCall - The block number after which the proposal can't be executed.
   * @param ballot: The initial vote from the signer's account.
   * @returns The transaction hash.
   */
  createProposal(
    signer: Signer,
    vaults: (string | VotingVault)[],
    targets: string[],
    calldatas: BytesLike[],
    lastCall: number,
    ballot: Ballot,
    options?: TransactionOptions & {
      /**
       * Extra data given to the vaults to help calculation
       */
      extraVaultData?: BytesLike[];
    },
  ): Promise<string> {
    const vaultAddresses = vaults.map((vault) =>
      vault instanceof VotingVault ? vault.address : vault,
    );
    return this.dataSource.createProposal(
      signer,
      vaultAddresses,
      targets,
      calldatas,
      lastCall,
      ballot,
      options,
    );
  }

  /**
   * Get the sum of voting power held by all voters in this voting contract.
   */
  async getTotalVotingPower(atBlock?: number): Promise<string> {
    const vaultPowers = await Promise.all(
      this.vaults.map((vault) => vault.getTotalVotingPower?.(atBlock) || "0"),
    );
    return sumStrings(vaultPowers);
  }

  /**
   * Get the voting power owned by a given address in this voting contract.
   * @param extraData - ABI encoded optional extra data used by some vaults, such
   *   as merkle proofs.
   */
  async getVotingPower(
    address: string,
    atBlock?: number,
    extraData?: BytesLike[],
  ): Promise<string> {
    const vaultPowers = await Promise.all(
      this.vaults.map((vault, i) =>
        vault.getVotingPower(address, atBlock, extraData?.[i]),
      ),
    );
    return sumStrings(vaultPowers);
  }

  /**
   * Get all participants that have voting power in this voting contract.
   */
  async getVoters(): Promise<Voter[]> {
    const vaultVoters = await Promise.all(
      this.vaults.map((vault) => vault.getVoters?.() || []),
    );
    const mergedVotersList = ([] as Voter[]).concat(...vaultVoters);
    return uniqBy<Voter>(mergedVotersList, (voter) => voter.address);
  }

  /**
   * Get all participants that have voting power in this voting contract along
   * with their voting power, the amount of voting power being delegated to
   * them, and the amount of power delegated to them by each delegator. This is
   * a convenience method to fetch voting power and delegation data for a large
   * number of voters in a single call.
   * @param address - Get a breakdown for a specific address.
   * @param fromBlock - Include all voters that had power on or after this block
   * number.
   * @param toBlock - Include all voters that had power on or before this block
   * number.
   */
  async getVotingPowerBreakdown(
    address?: string,
    fromBlock?: number,
    toBlock?: number,
  ): Promise<VoterPowerBreakdown[]> {
    // get a list of breakdowns for each vault
    const vaultBreakdowns = await Promise.all(
      this.vaults.map(
        (vault) =>
          vault.getVotingPowerBreakdown?.(address, fromBlock, toBlock) || [],
      ),
    );

    // concatenate them together into a single array
    const mergedBreakdownsList = ([] as VoterPowerBreakdown[]).concat(
      ...vaultBreakdowns,
    );

    // create a temp object to merge unique addresses
    const breakdownsByVoter: Record<
      string,
      VoterWithPower & {
        fromDelegators: string;
        byDelegator: Record<string, VoterWithPower>;
      }
    > = {};

    for (const {
      voter,
      votingPower,
      votingPowerFromDelegators,
      delegators,
    } of mergedBreakdownsList) {
      const breakdown = breakdownsByVoter[voter.address];

      if (!breakdown) {
        // Add a breakdown for this voter in the unique list
        breakdownsByVoter[voter.address] = {
          voter,
          votingPower,
          fromDelegators: votingPowerFromDelegators,
          // key delegators by their address
          byDelegator: Object.fromEntries(
            delegators.map((delegatorWithPower) => [
              delegatorWithPower.voter.address,
              delegatorWithPower,
            ]),
          ),
        };
      } else {
        // if a breakdown for this voter already exists, then merge with the
        // current one.
        breakdown.votingPower = sumStrings([
          breakdown.votingPower,
          votingPower,
        ]);
        breakdown.fromDelegators = sumStrings([
          breakdown.fromDelegators,
          votingPowerFromDelegators,
        ]);

        for (const delegatorWithPower of delegators) {
          if (!breakdown.byDelegator[delegatorWithPower.voter.address]) {
            // Add the delegator with power to the breakdown in the unique list
            breakdown.byDelegator[delegatorWithPower.voter.address] =
              delegatorWithPower;
          } else {
            breakdown.byDelegator[
              delegatorWithPower.voter.address
            ].votingPower = sumStrings([
              breakdown.byDelegator[delegatorWithPower.voter.address]
                .votingPower,
              delegatorWithPower.votingPower,
            ]);
          }
        }
      }
    }
    return Object.values(breakdownsByVoter).map(
      ({ voter, votingPower, fromDelegators, byDelegator }) => ({
        voter,
        votingPower,
        votingPowerFromDelegators: fromDelegators,
        delegators: Object.values(byDelegator),
      }),
    );
  }

  /**
   * Get all casted votes on proposals in this voting contract.
   * @param fromBlock - The starting block number for the range of blocks fetched.
   * @param toBlock - The ending block number for the range of blocks fetched.
   */
  async getVotes(
    address?: string,
    proposalId?: number,
    fromBlock?: number,
    toBlock?: number,
  ): Promise<Vote[]> {
    const votes = await this.dataSource.getVotes(
      address,
      proposalId,
      fromBlock,
      toBlock,
    );
    return votes.map(
      ({ address, proposalId, power, ballot }) =>
        new Vote(
          power,
          ballot,
          new Voter(address, this.context),
          new Proposal(proposalId, this, this.context),
          this.context,
        ),
    );
  }

  /**
   * Get the number of proposals an address has voted on and the number of
   * proposals that they were able to vote on. If the numbers are the same, then
   * the address has voted on every proposal they were able to.
   */
  async getParticipation(address: string): Promise<[number, number]> {
    const votes = await this.getVotes(address);
    const votedProposalIds = votes.map((vote) => vote.proposal.id);
    const proposals = await this.getProposals();
    const proposalsNotVoted = await Promise.all(
      proposals
        .filter((proposal) => !votedProposalIds.includes(proposal.id))
        .map(async (proposal) =>
          // could be null if the proposal has been deleted and the created
          // block can't be fetched.
          parseEther((await proposal.getVotingPower(address)) || "0").gt(0),
        ),
    );
    const missedVotesCount = proposalsNotVoted.filter(Boolean).length;
    return [proposals.length - missedVotesCount, proposals.length];
  }
}
