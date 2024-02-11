import { ReadWriteContractFactory } from "src/contract/factory";
import { ReadWriteModelOptions } from "src/models/Model";
import { ReadWriteAirdrop } from "src/models/airdrop/ReadWriteAirdrop";
import { ReadWriteCoreVoting } from "src/models/coreVoting/ReadWriteCoreVoting";
import { ReadCouncil } from "src/models/council/ReadCouncil";
import { ReadWriteToken } from "src/models/token/ReadWriteToken";
import { ReadVotingVault } from "src/models/votingVault/ReadVotingVault";
import { ReadWriteGscVault } from "src/models/votingVault/gscVault/ReadWriteGscVault";
import { ReadWriteLockingVault } from "src/models/votingVault/lockingVault/ReadWriteLockingVault";
import { ReadWriteVestingVault } from "src/models/votingVault/vestingVault/ReadWriteVestingVault";

export interface ReadWriteCouncilOptions extends ReadWriteModelOptions {}

export class ReadWriteCouncil extends ReadCouncil {
  protected declare _contractFactory: ReadWriteContractFactory;

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

  gscVault(address: `0x${string}`): ReadWriteGscVault {
    return new ReadWriteGscVault({
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
