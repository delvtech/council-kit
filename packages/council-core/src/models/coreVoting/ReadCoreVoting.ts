import { CoreVoting } from "@delvtech/council-artifacts/CoreVoting";
import { CachedReadContract } from "@delvtech/evm-client";
import { Model, ReadContractModelOptions } from "src/models/Model";
import { ReadVote } from "src/models/ReadVote";
import { ReadVoter } from "src/models/ReadVoter";
import {
  BALLOTS,
  EXECUTED_PROPOSAL_HASH,
} from "src/models/coreVoting/constants";
import { CoreVotingAbi } from "src/models/coreVoting/types";
import { ReadProposal } from "src/models/proposal/ReadProposal";
import { ReadVotingVault } from "src/models/votingVault/ReadVotingVault";
import { BlockLike } from "src/utils/blockToReadOptions";

/**
 * @category Models
 */
export interface ReadCoreVotingOptions extends ReadContractModelOptions {
  vaults?: (ReadVotingVault | `0x${string}`)[];
}

/**
 * @category Models
 */
export class ReadCoreVoting extends Model {
  contract: CachedReadContract<CoreVotingAbi>;
  vaults: ReadVotingVault[];

  /**
   * Create a new CoreVoting model instance.
   * @param address - The address of the deployed contract.
   * @param vaults - The VotingVault instances or addresses of the vaults that are
   *   approved for this voting contract.
   */
  constructor({
    address,
    contractFactory,
    network,
    cache,
    namespace,
    name,
    vaults = [],
  }: ReadCoreVotingOptions) {
    super({ contractFactory, network, name });

    this.contract = contractFactory({
      abi: CoreVoting.abi,
      address,
      cache,
      namespace,
    });

    this.vaults = vaults.map((vault) =>
      vault instanceof ReadVotingVault
        ? vault
        : new ReadVotingVault({
            address: vault,
            contractFactory,
            network,
          }),
    );
  }

  get address(): `0x${string}` {
    return this.contract.address;
  }
  get namespace(): string | undefined {
    return this.contract.namespace;
  }

  /**
   * Get a proposal by id.
   */
  async getProposal({ id }: { id: bigint }): Promise<ReadProposal | undefined> {
    const proposalInfo = await this._getProposalInfo({ id });
    if (proposalInfo) {
      return new ReadProposal({
        ...proposalInfo,
        coreVoting: this,
        contractFactory: this.contractFactory,
        network: this.network,
      });
    }
  }

  /**
   * Get all proposals ever created.
   * @param fromBlock - Include all proposals created on or after this block number.
   * @param toBlock - Include all proposals created on or before this block number.
   */
  async getProposals({
    fromBlock,
    toBlock,
  }: {
    fromBlock?: BlockLike;
    toBlock?: BlockLike;
  } = {}): Promise<ReadProposal[]> {
    const createdEvents = await this.contract.getEvents("ProposalCreated", {
      fromBlock,
      toBlock,
    });
    return createdEvents.map(
      ({ args: { proposalId, created, execution, expiration } }) =>
        new ReadProposal({
          contractFactory: this.contractFactory,
          coreVoting: this,
          created,
          expiration,
          id: proposalId,
          unlock: execution,
          network: this.network,
        }),
    );
  }

  /**
   * Get the voting power owned by a given address in all vaults.
   * @param extraData - ABI encoded optional extra data used by some vaults, such
   *   as merkle proofs.
   */
  async getVotingPower({
    account,
    atBlock,
    extraData,
  }: {
    account: ReadVoter | `0x${string}`;
    atBlock?: BlockLike;
    extraData?: `0x${string}`[];
  }): Promise<bigint> {
    const vaultPowers = await Promise.all(
      this.vaults.map((vault, i) =>
        vault.getVotingPower({
          account: account,
          atBlock,
          extraData: extraData?.[i],
        }),
      ),
    );
    return vaultPowers.reduce((sum, power) => sum + power);
  }

  /**
   * Get a casted vote for a given address on a given proposal id.
   */
  async getVote({
    account,
    proposalId,
  }: {
    account: ReadVoter | `0x${string}`;
    proposalId: bigint;
  }): Promise<ReadVote | undefined> {
    const { castBallot, votingPower } = await this.contract.read("votes", {
      "0": account instanceof ReadVoter ? account.address : account,
      "1": proposalId,
    });

    if (votingPower === 0n) {
      return;
    }

    return new ReadVote({
      ballot: BALLOTS[castBallot],
      contractFactory: this.contractFactory,
      network: this.network,
      power: votingPower,
      proposal: (await this.getProposal({ id: proposalId }))!,
      voter: account,
    });
  }

  /**
   * Get all casted votes on proposals in this voting contract.
   * @param fromBlock - The starting block number for the range of blocks fetched.
   * @param toBlock - The ending block number for the range of blocks fetched.
   */
  async getVotes({
    proposalId,
    account,
    fromBlock,
    toBlock,
  }: {
    proposalId?: bigint;
    account?: ReadVoter | `0x${string}`;
    fromBlock?: BlockLike;
    toBlock?: BlockLike;
  } = {}): Promise<ReadVote[]> {
    const voteEvents = await this.contract.getEvents("Voted", {
      filter: {
        voter:
          typeof account === "string" || !account ? account : account.address,
        proposalId,
      },
      fromBlock,
      toBlock,
    });

    const votes: ReadVote[] = [];

    for (const {
      args: {
        proposalId,
        vote: { castBallot, votingPower },
        voter,
      },
    } of voteEvents) {
      const proposal = await this.getProposal({ id: proposalId });
      votes.push(
        new ReadVote({
          ballot: BALLOTS[castBallot],
          contractFactory: this.contractFactory,
          network: this.network,
          power: votingPower,
          proposal: proposal!,
          voter,
        }),
      );
    }

    return votes;
  }

  /**
   * Get the number of proposals an address has voted on and the number of
   * proposals that they were able to vote on. If the numbers are the same, then
   * the address has voted on every proposal they were able to.
   */
  async getParticipation({
    account,
    fromBlock,
    toBlock,
  }: {
    account: ReadVoter | `0x${string}`;
    fromBlock?: BlockLike;
    toBlock?: BlockLike;
  }): Promise<[number, number]> {
    const votes = await this.getVotes({
      account: account,
      fromBlock,
      toBlock,
    });
    const votedProposalIds = votes.map(({ proposal: { id } }) => id);
    const proposals = await this.getProposals();
    const proposalsNotVoted = await Promise.all(
      proposals
        .filter(({ id }) => !votedProposalIds.includes(id))
        .map(
          async (proposal) =>
            // could be null if the proposal has been deleted and the created
            // block can't be fetched.
            ((await proposal.getVotingPower({ account: account })) || 0n) > 0n,
        ),
    );
    const missedVotesCount = proposalsNotVoted.filter(Boolean).length;
    return [proposals.length - missedVotesCount, proposals.length];
  }

  /**
   * Get a proposal by id.
   */
  protected async _getProposalInfo({ id }: { id: bigint }): Promise<
    | {
        id: bigint;
        created: bigint;
        expiration: bigint;
        lastCall?: bigint;
        proposalHash?: `0x${string}`;
        requiredQuorum?: bigint;
        unlock?: bigint;
      }
    | undefined
  > {
    const { created, expiration, lastCall, proposalHash, quorum, unlock } =
      await this.contract.read("proposals", id);

    if (proposalHash !== EXECUTED_PROPOSAL_HASH) {
      return {
        id,
        created,
        expiration,
        lastCall,
        proposalHash,
        requiredQuorum: quorum,
        unlock,
      };
    }

    const createdEvents = await this.contract.getEvents("ProposalCreated");
    const createdEvent = createdEvents.find(
      ({ args: { proposalId } }) => proposalId === id,
    );

    if (createdEvent) {
      const {
        args: { created, execution, expiration },
      } = createdEvent;
      return {
        id,
        created,
        expiration,
        unlock: execution,
      };
    }
  }
}
