import {
  LockingVault,
  VestingVault,
  Voter,
  VotingContract,
  VotingVault,
  VotingVaultDataSource,
} from "@council/sdk";

export interface VoterDataByTokenWithDelegationVault {
  vault: VotingVault;
  votingPower: string;
  balance?: string;
  votersDelegated?: Voter[];
  currentDelegate?: Voter;
}

export async function getVoterDataByTokenWithDelegationVault(
  address: string,
  coreVoting: VotingContract<VotingVault<VotingVaultDataSource>[]>,
): Promise<VoterDataByTokenWithDelegationVault[]> {
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
          currentDelegate,
        };
      }

      if (vault instanceof VestingVault) {
        const balance = (await vault.getGrant(address)).votingPower;
        const votersDelegated = await vault.getDelegatorsTo(address);
        const currentDelegate = await vault.getDelegate(address);
        return {
          vault,
          votingPower,
          balance,
          votersDelegated,
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
