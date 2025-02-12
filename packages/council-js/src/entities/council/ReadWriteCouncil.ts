import { Address, ReadWriteAdapter } from "@delvtech/drift";
import { ReadWriteAirdrop } from "src/entities/airdrop/ReadWriteAirdrop";
import { ReadWriteCoreVoting } from "src/entities/coreVoting/ReadWriteCoreVoting";
import { ReadCouncil } from "src/entities/council/ReadCouncil";
import { ReadWriteToken } from "src/entities/token/ReadWriteToken";
import { ReadWriteGscVault } from "src/entities/votingVault/gscVault/ReadWriteGscVault";
import { ReadWriteLockingVault } from "src/entities/votingVault/lockingVault/ReadWriteLockingVault";
import { ReadWriteVestingVault } from "src/entities/votingVault/vestingVault/ReadWriteVestingVault";

export class ReadWriteCouncil<
  A extends ReadWriteAdapter = ReadWriteAdapter,
> extends ReadCouncil<A> {
  coreVoting(address: Address) {
    return new ReadWriteCoreVoting({
      address,
      drift: this.drift,
    });
  }

  lockingVault(address: Address) {
    return new ReadWriteLockingVault({
      address,
      drift: this.drift,
    });
  }

  vestingVault(address: Address) {
    return new ReadWriteVestingVault({
      address,
      drift: this.drift,
    });
  }

  gscVault(address: Address) {
    return new ReadWriteGscVault({
      address,
      drift: this.drift,
    });
  }

  airdrop(address: Address) {
    return new ReadWriteAirdrop({
      address,
      drift: this.drift,
    });
  }

  token(address: Address) {
    return new ReadWriteToken({
      address,
      drift: this.drift,
    });
  }
}
