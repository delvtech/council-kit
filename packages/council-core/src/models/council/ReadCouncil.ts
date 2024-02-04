import { Network } from "@council/evm-client";
import { CachedReadContractFactory } from "src/contract/factory";
import { ReadAirdrop } from "src/models/airdrop/ReadAirdrop";
import { ReadCoreVoting } from "src/models/coreVoting/ReadCoreVoting";
import { Model, ReadModelOptions } from "src/models/Model";
import { ReadVoter } from "src/models/ReadVoter";
import { ReadToken } from "src/models/token/ReadToken";
import { ReadGscVault } from "src/models/votingVault/gscVault/ReadGscVault";
import { ReadLockingVault } from "src/models/votingVault/lockingVault/ReadLockingVault";
import { ReadVotingVault } from "src/models/votingVault/ReadVotingVault";
import { ReadVestingVault } from "src/models/votingVault/vestingVault/ReadVestingVault";

export interface ReadCouncilOptions extends ReadModelOptions {}

export class ReadCouncil extends Model {
  protected _contractFactory: CachedReadContractFactory;
  protected _network: Network;

  constructor({ contractFactory, network, name }: ReadCouncilOptions) {
    super({ contractFactory, network, name });
    this._contractFactory = contractFactory;
    this._network = network;
  }

  coreVoting({
    address,
    vaults,
  }: {
    address: `0x${string}`;
    vaults: (ReadVotingVault | `0x${string}`)[];
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
