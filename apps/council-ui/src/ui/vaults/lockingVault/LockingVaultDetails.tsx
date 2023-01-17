import { LockingVault } from "@council/sdk";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Signer } from "ethers";
import { ReactElement } from "react";
import { councilConfigs } from "src/config/council.config";
import { ErrorMessage } from "src/ui/base/error/ErrorMessage";
import { Page } from "src/ui/base/Page";
import { useCouncil } from "src/ui/council/useCouncil";
import { useChainId } from "src/ui/network/useChainId";

import {
  ChangeDelegateForm,
  ChangeDelegateFormSkeleton,
} from "src/ui/vaults/ChangeDelegateForm";
import {
  DepositAndWithdrawForm,
  DepositAndWithdrawFormSkeleton,
} from "src/ui/vaults/DepositAndWithdrawForm";
import { useApprove } from "src/ui/vaults/lockingVault/hooks/useApprove";
import { useChangeDelegate } from "src/ui/vaults/lockingVault/hooks/useChangeDelegate";
import { useDeposit } from "src/ui/vaults/lockingVault/hooks/useDeposit";
import { useWithdraw } from "src/ui/vaults/lockingVault/hooks/useWithdraw";
import { VaultHeader, VaultHeaderSkeleton } from "src/ui/vaults/VaultHeader";
import {
  VaultStatsBar,
  VaultStatsBarSkeleton,
} from "src/ui/vaults/VaultStatsBar";
import { useAccount, useSigner } from "wagmi";

interface LockingVaultDetailsProps {
  address: string;
}

export function LockingVaultDetails({
  address,
}: LockingVaultDetailsProps): ReactElement {
  const { address: account } = useAccount();
  const { data: signer } = useSigner();
  const { data, status, error } = useLockingVaultDetailsData(address, account);

  const { mutate: changeDelegate } = useChangeDelegate(address);
  const { mutate: deposit } = useDeposit(address);
  const { mutate: withdraw } = useWithdraw(address);
  const { mutate: approve } = useApprove(address);

  if (status === "error") {
    return <ErrorMessage error={error} />;
  }

  return (
    <Page>
      {status === "success" ? (
        <VaultHeader name={data.name} descriptionURL={data.descriptionURL} />
      ) : (
        <VaultHeaderSkeleton />
      )}

      {status === "success" ? (
        <VaultStatsBar
          activeProposalCount={data.activeProposalCount}
          accountVotingPower={data.accountVotingPower}
          accountPercentOfTVP={data.accountPercentOfTVP}
          delegatedToAccount={data.delegatedToAccount}
          participants={data.participants}
          tokenAddress={data.tokenAddress}
          tokenSymbol={data.tokenSymbol}
        />
      ) : (
        <VaultStatsBarSkeleton />
      )}

      <div className="flex flex-col w-full h-48 gap-8 sm:flex-row">
        {status === "success" ? (
          <DepositAndWithdrawForm
            symbol={data.tokenSymbol}
            balance={data.tokenBalance}
            allowance={data.tokenAllowance}
            depositedBalance={data.depositedBalance}
            disabled={!signer}
            onApprove={() => approve({ signer: signer as Signer })}
            onDeposit={(amount) =>
              deposit({ signer: signer as Signer, amount })
            }
            onWithdraw={(amount) =>
              withdraw({ signer: signer as Signer, amount })
            }
          />
        ) : (
          <DepositAndWithdrawFormSkeleton />
        )}

        {status === "success" ? (
          <ChangeDelegateForm
            currentDelegate={data.delegate}
            disabled={!signer}
            onDelegate={(delegate) =>
              changeDelegate({ signer: signer as Signer, delegate })
            }
          />
        ) : (
          <ChangeDelegateFormSkeleton />
        )}
      </div>
    </Page>
  );
}

interface LockingVaultDetailsData {
  accountPercentOfTVP: number;
  accountVotingPower: string;
  activeProposalCount: number;
  delegate: string;
  delegatedToAccount: number;
  depositedBalance: string;
  descriptionURL: string | undefined;
  name: string | undefined;
  participants: number;
  tokenAddress: string;
  tokenAllowance: string;
  tokenBalance: string;
  tokenSymbol: string;
}

function useLockingVaultDetailsData(
  address: string,
  account: string | undefined,
): UseQueryResult<LockingVaultDetailsData> {
  const { context, coreVoting } = useCouncil();
  const chainId = useChainId();
  const coreVotingConfig = councilConfigs[chainId].coreVoting;
  const vaultConfig = coreVotingConfig.vaults.find(
    (vault) => vault.address === address,
  );

  return useQuery({
    queryKey: ["lockingVaultDetails", address, account],
    enabled: !!account,
    queryFn: async () => {
      const lockingVault = new LockingVault(address, context);
      const token = await lockingVault.getToken();
      const delegate = await lockingVault.getDelegate(account as string);

      let activeProposalCount = 0;
      const proposals = await coreVoting.getProposals();
      for (const proposal of proposals) {
        if (await proposal.getIsActive()) {
          activeProposalCount++;
        }
      }

      const accountVotingPower = await lockingVault.getVotingPower(
        account as string,
      );

      return {
        accountPercentOfTVP:
          (+accountVotingPower / +(await lockingVault.getTotalVotingPower())) *
          100,
        accountVotingPower,

        tokenAddress: token.address,
        tokenSymbol: await token.getSymbol(),
        tokenBalance: await token.getBalanceOf(account as string),
        tokenAllowance: await token.getAllowance(account as string, address),
        depositedBalance: await lockingVault.getDepositedBalance(
          account as string,
        ),

        delegate: delegate.address,
        descriptionURL: vaultConfig?.descriptionURL,
        name: vaultConfig?.name,
        activeProposalCount,
        participants: (await lockingVault.getVoters()).length,
        delegatedToAccount: (
          await lockingVault.getDelegatorsTo(account as string)
        ).length,
      };
    },
  });
}
