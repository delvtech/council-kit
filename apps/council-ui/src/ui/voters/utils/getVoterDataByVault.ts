import {
  LockingVault,
  VestingVault,
  Voter,
  VotingContract,
  VotingVault,
  VotingVaultDataSource,
} from "@council/sdk";

export interface VoterDataByVault {
  vault: VotingVault;
  votingPower: string;
  balance?: string;
  numDelegated?: number;
  votersDelegated?: Voter[];
  currentDelegate?: Voter;
}

export async function getVoterDataByVault(
  address: string,
  coreVoting: VotingContract<VotingVault<VotingVaultDataSource>[]>,
): Promise<VoterDataByVault[]> {
  return Promise.all(
    coreVoting.vaults.map(async (vault) => {
      const name = vault.name;
      const votingPower = await vault.getVotingPower(address);

      if (vault instanceof LockingVault) {
        const balance = await vault.getDepositedBalance(address);
        const votersDelegated = await vault.getDelegatorsTo(address);
        const currentDelegate = await vault.getDelegate(address);
        return {
          vault,
          votingPower,
          balance,
          votersDelegated,
          numDelegated: votersDelegated.length,
          currentDelegate,
        };
      }

      if (vault instanceof VestingVault) {
        const balance = await (await vault.getGrant(address)).votingPower;
        const votersDelegated = await vault.getDelegatorsTo(address);
        const currentDelegate = await vault.getDelegate(address);
        return {
          vault,
          votingPower,
          balance,
          votersDelegated,
          numDelegated: votersDelegated.length,
          currentDelegate,
        };
      }

      return {
        vault,
        name,
        votingPower,
      };
    }),
  );
}
