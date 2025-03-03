import { ReadCouncil } from "@delvtech/council-js";
import { VaultConfig } from "src/config/types";

export async function getTotalVotingPower({
  vault,
  council,
}: {
  vault: VaultConfig;
  council: ReadCouncil;
}): Promise<bigint | undefined> {
  switch (vault.type) {
    case "LockingVault":
    case "FrozenLockingVault":
      return council.lockingVault(vault.address).getTotalVotingPower();

    case "VestingVault":
      return council.vestingVault(vault.address).getTotalVotingPower();
  }
}
