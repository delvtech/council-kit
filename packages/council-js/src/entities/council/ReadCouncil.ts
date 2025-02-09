import { Network } from "@delvtech/evm-client";
import { ReadContractFactory } from "src/contract/factory";
import { ReadAirdrop } from "src/entities/airdrop/ReadAirdrop";
import { ReadCoreVoting } from "src/entities/coreVoting/ReadCoreVoting";
import { Model, ReadModelOptions } from "src/entities/Model";
import { ReadVoter } from "src/entities/ReadVoter";
import { ReadToken } from "src/entities/token/ReadToken";
import { ReadGscVault } from "src/entities/votingVault/gscVault/ReadGscVault";
import { ReadLockingVault } from "src/entities/votingVault/lockingVault/ReadLockingVault";
import { ReadVotingVault } from "src/entities/votingVault/ReadVotingVault";
import { ReadVestingVault } from "src/entities/votingVault/vestingVault/ReadVestingVault";

export interface ReadCouncilOptions extends ReadModelOptions {}

export class ReadCouncil extends Model {
  protected _contractFactory: ReadContractFactory;
  protected _network: Network;

  constructor({
    name = "Council",
    contractFactory,
    network,
  }: ReadCouncilOptions) {
    super({ contractFactory, network, name });
    this._contractFactory = contractFactory;
    this._network = network;
  }

  coreVoting({
    address,
    vaults,
  }: {
    address: `0x${string}`;
    vaults?: (ReadVotingVault | `0x${string}`)[];
  }): ReadCoreVoting {
    return new ReadCoreVoting({
      address,
      contractFactory: this._contractFactory,
      network: this._network,
      vaults,
    });
  }

  voter(address: `0x${string}`): ReadVoter {
    return new ReadVoter({
      address,
      contractFactory: this._contractFactory,
      network: this._network,
    });
  }

  votingVault(address: `0x${string}`): ReadVotingVault {
    return new ReadVotingVault({
      address,
      contractFactory: this._contractFactory,
      network: this._network,
    });
  }

  lockingVault(address: `0x${string}`): ReadLockingVault {
    return new ReadLockingVault({
      address,
      contractFactory: this._contractFactory,
      network: this._network,
    });
  }

  vestingVault(address: `0x${string}`): ReadVestingVault {
    return new ReadVestingVault({
      address,
      contractFactory: this._contractFactory,
      network: this._network,
    });
  }

  gscVault(address: `0x${string}`): ReadGscVault {
    return new ReadGscVault({
      address,
      contractFactory: this._contractFactory,
      network: this._network,
    });
  }

  airdrop(address: `0x${string}`): ReadAirdrop {
    return new ReadAirdrop({
      address,
      contractFactory: this._contractFactory,
      network: this._network,
    });
  }

  token(address: `0x${string}`): ReadToken {
    return new ReadToken({
      address,
      contractFactory: this._contractFactory,
      network: this._network,
    });
  }
}
