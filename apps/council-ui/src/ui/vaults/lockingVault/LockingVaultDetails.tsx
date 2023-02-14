import { LockingVault } from "@council/sdk";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ethers, Signer } from "ethers";
import { isAddress } from "ethers/lib/utils";
import { ReactElement } from "react";
import { councilConfigs } from "src/config/council.config";
import { ErrorMessage } from "src/ui/base/error/ErrorMessage";
import { makeTransactionErrorToast } from "src/ui/base/toast/makeTransactionErrorToast";
import { useCouncil } from "src/ui/council/useCouncil";
import { useChainId } from "src/ui/network/useChainId";

import { ChangeDelegateForm } from "src/ui/vaults/ChangeDelegateForm";
import { DepositAndWithdrawForm } from "src/ui/vaults/DepositAndWithdrawForm";
import { useApprove } from "src/ui/vaults/lockingVault/hooks/useApprove";
import { useChangeDelegate } from "src/ui/vaults/lockingVault/hooks/useChangeDelegate";
import { useDeposit } from "src/ui/vaults/lockingVault/hooks/useDeposit";
import { useWithdraw } from "src/ui/vaults/lockingVault/hooks/useWithdraw";
import { LockingVaultStatsRow } from "src/ui/vaults/lockingVault/LockingVaultStatsRow";
import { VaultDetails } from "src/ui/vaults/VaultDetails/VaultDetails";
import { VaultDetailsSkeleton } from "src/ui/vaults/VaultDetails/VaultDetailsSkeleton";
import { VaultHeader } from "src/ui/vaults/VaultHeader";
import { useAccount, useSigner } from "wagmi";

interface LockingVaultDetailsProps {
  address: string;
}

export function LockingVaultDetails({
  address,
}: LockingVaultDetailsProps): ReactElement {
  const { address: account } = useAccount();
  const chainId = useChainId();
  const { data: signer } = useSigner();
  const { data, status, error } = useLockingVaultDetailsData(address, account);

  const { mutate: changeDelegate, isLoading: isDelegating } =
    useChangeDelegate(address);
  const { mutate: deposit, isLoading: isDepositing } = useDeposit(address);
  const { mutate: withdraw, isLoading: isWithdrawing } = useWithdraw(address);
  const { mutate: approve, isLoading: isApproving } = useApprove(address);

  if (status === "error") {
    return <ErrorMessage error={error} />;
  }
  if (status !== "success") {
    return <VaultDetailsSkeleton />;
  }

  async function handleDelegate(delegate: string): Promise<void> {
    let address: string | null | undefined = delegate;
    if (!isAddress(delegate)) {
      address = await signer?.provider?.resolveName(delegate);
    }
    if (!address) {
      makeTransactionErrorToast(
        `Could not find address for ${delegate}`,
        undefined,
        chainId,
      );
      return;
    }
    return changeDelegate({
      signer: signer as Signer,
      delegate: address,
    });
  }

  return (
    <VaultDetails
      paragraphSummary={data.paragraphSummary}
      header={
        <VaultHeader name={data.name} descriptionURL={data.descriptionURL} />
      }
      statsRow={
        <LockingVaultStatsRow
          accountVotingPower={data.accountVotingPower}
          delegatedToAccount={data.delegatedToAccount}
          participants={data.participants}
          tokenAddress={data.tokenAddress}
          tokenSymbol={data.tokenSymbol}
        />
      }
      actions={
        <>
          <DepositAndWithdrawForm
            symbol={data.tokenSymbol}
            balance={data.tokenBalance}
            allowance={data.tokenAllowance}
            depositedBalance={data.depositedBalance}
            disabled={!signer || isApproving || isDepositing || isWithdrawing}
            onApprove={() => approve({ signer: signer as Signer })}
            onDeposit={(amount) =>
              deposit({ signer: signer as Signer, amount })
            }
            onWithdraw={(amount) =>
              withdraw({ signer: signer as Signer, amount })
            }
          />

          <ChangeDelegateForm
            currentDelegate={data.delegate || ethers.constants.AddressZero}
            depositedBalance={data.depositedBalance}
            onDelegate={handleDelegate}
            disabled={!signer || !+data.depositedBalance || isDelegating}
          />
        </>
      }
    />
  );
}

interface LockingVaultDetailsData {
  accountVotingPower: string;
  activeProposalCount: number;
  delegate?: string;
  delegatedToAccount: number;
  depositedBalance: string;
  descriptionURL: string | undefined;
  paragraphSummary: string | undefined;
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
  const { context } = useCouncil();
  const chainId = useChainId();
  const coreVotingConfig = councilConfigs[chainId].coreVoting;
  const vaultConfig = coreVotingConfig.vaults.find(
    (vault) => vault.address === address,
  );

  return useQuery({
    queryKey: ["lockingVaultDetails", address, account],
    queryFn: async () => {
      const lockingVault = new LockingVault(address, context);
      const token = await lockingVault.getToken();
      const delegate = account
        ? await lockingVault.getDelegate(account)
        : undefined;
      const accountVotingPower = account
        ? await lockingVault.getVotingPower(account)
        : "0";

      return {
        accountVotingPower,

        tokenAddress: token.address,
        tokenSymbol: await token.getSymbol(),
        tokenBalance: account ? await token.getBalanceOf(account) : "0",
        tokenAllowance: account
          ? await token.getAllowance(account, address)
          : "0",
        depositedBalance: account
          ? await lockingVault.getDepositedBalance(account)
          : "0",

        delegate: delegate?.address,
        descriptionURL: vaultConfig?.descriptionURL,
        paragraphSummary: vaultConfig?.paragraphSummary,
        name: vaultConfig?.name,
        participants: (await lockingVault.getVoters()).length,
        delegatedToAccount: account
          ? (await lockingVault.getDelegatorsTo(account)).length
          : 0,
      };
    },
  });
}
