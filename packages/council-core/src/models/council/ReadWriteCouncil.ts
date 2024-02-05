import { CachedReadWriteContractFactory } from "src/contract/factory";
import { ReadWriteAirdrop } from "src/models/airdrop/ReadWriteAirdrop";
import { ReadWriteCoreVoting } from "src/models/coreVoting/ReadWriteCoreVoting";
import { ReadCouncil } from "src/models/council/ReadCouncil";
import { ReadWriteModelOptions } from "src/models/Model";
import { ReadWriteToken } from "src/models/token/ReadWriteToken";
import { ReadWriteGSCVault } from "src/models/votingVault/gscVault/ReadWriteGscVault";
import { ReadWriteLockingVault } from "src/models/votingVault/lockingVault/ReadWriteLockingVault";
import { ReadVotingVault } from "src/models/votingVault/ReadVotingVault";
import { ReadWriteVestingVault } from "src/models/votingVault/vestingVault/ReadWriteVestingVault";

export interface ReadWriteCouncilOptions extends ReadWriteModelOptions {}

export class ReadWriteCouncil extends ReadCouncil {
  protected declare _contractFactory: CachedReadWriteContractFactory;

  constructor(options: ReadWriteCouncilOptions) {
    super(options);
  }

  coreVoting({
    address,
    vaults,
  }: {
    address: `0x${string}`;
    vaults?: (ReadVotingVault | `0x${string}`)[];
  }): ReadWriteCoreVoting {
    return new ReadWriteCoreVoting({
      address,
      contractFactory: this._contractFactory,
      network: this._network,
      vaults,
    });
  }

  lockingVault(address: `0x${string}`): ReadWriteLockingVault {
    return new ReadWriteLockingVault({
      address,
      contractFactory: this._contractFactory,
      network: this._network,
    });
  }

  vestingVault(address: `0x${string}`): ReadWriteVestingVault {
    return new ReadWriteVestingVault({
      address,
      contractFactory: this._contractFactory,
      network: this._network,
    });
  }

  gscVault(address: `0x${string}`): ReadWriteGSCVault {
    return new ReadWriteGSCVault({
      address,
      contractFactory: this._contractFactory,
      network: this._network,
    });
  }

  airdrop(address: `0x${string}`): ReadWriteAirdrop {
    return new ReadWriteAirdrop({
      address,
      contractFactory: this._contractFactory,
      network: this._network,
    });
  }

  token(address: `0x${string}`): ReadWriteToken {
    return new ReadWriteToken({
      address,
      contractFactory: this._contractFactory,
      network: this._network,
    });
  }
}
