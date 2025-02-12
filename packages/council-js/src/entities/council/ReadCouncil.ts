import { Adapter, Address } from "@delvtech/drift";
import { ReadAirdrop } from "src/entities/airdrop/ReadAirdrop";
import { ReadCoreVoting } from "src/entities/coreVoting/ReadCoreVoting";
import { Entity } from "src/entities/Entity";
import { ReadToken } from "src/entities/token/ReadToken";
import { ReadGscVault } from "src/entities/votingVault/gscVault/ReadGscVault";
import { ReadLockingVault } from "src/entities/votingVault/lockingVault/ReadLockingVault";
import { ReadVotingVault } from "src/entities/votingVault/ReadVotingVault";
import { ReadVestingVault } from "src/entities/votingVault/vestingVault/ReadVestingVault";

export class ReadCouncil<A extends Adapter = Adapter> extends Entity<A> {
  coreVoting(address: Address) {
    return new ReadCoreVoting({
      address,
      drift: this.drift,
    });
  }

  votingVault(address: Address) {
    return new ReadVotingVault({
      address,
      drift: this.drift,
    });
  }

  lockingVault(address: Address) {
    return new ReadLockingVault({
      address,
      drift: this.drift,
    });
  }

  vestingVault(address: Address) {
    return new ReadVestingVault({
      address,
      drift: this.drift,
    });
  }

  gscVault(address: Address) {
    return new ReadGscVault({
      address,
      drift: this.drift,
    });
  }

  airdrop(address: Address) {
    return new ReadAirdrop({
      address,
      drift: this.drift,
    });
  }

  token(address: Address) {
    return new ReadToken({
      address,
      drift: this.drift,
    });
  }
}
