import { LockingVault } from "@council/sdk";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { ethers, Signer } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { ReactElement } from "react";
import toast from "react-hot-toast";
import { councilConfigs } from "src/config/council.config";
import { ErrorMessage } from "src/ui/base/error/ErrorMessage";
import { formatAddress } from "src/ui/base/formatting/formatAddress";
import { Page } from "src/ui/base/Page";
import { useCouncil } from "src/ui/council/useCouncil";
import { useChainId } from "src/ui/network/useChainId";
import { useAccount, useSigner } from "wagmi";
import {
  ChangeDelegateForm,
  ChangeDelegateFormSkeleton,
} from "./base/ChangeDelegateForm";
import {
  DepositAndWithdrawForm,
  DepositAndWithdrawFormSkeleton,
} from "./base/DepositAndWithdrawForm";
import { VaultHeader, VaultHeaderSkeleton } from "./base/VaultHeader";
import {
  VaultStatsBar,
  VaultStatsBarSkeleton,
} from "./components/VaultStatsBar";

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

interface ApproveArguments {
  signer: Signer;
}

function useApprove(vaultAddress: string) {
  const { context } = useCouncil();
  const queryClient = useQueryClient();
  let toastId: string;
  return useMutation(
    async ({ signer }: ApproveArguments): Promise<string> => {
      const vault = new LockingVault(vaultAddress, context);
      const token = await vault.getToken();
      const decimals = await token.getDecimals();
      return token.approve(
        signer,
        vault.address,
        formatUnits(ethers.constants.MaxUint256, decimals),
        {
          onSubmitted: () => (toastId = toast.loading("Approving")),
        },
      );
    },
    {
      onSuccess: () => {
        toast.success(`Successfully approved!`, {
          id: toastId,
        });
        queryClient.invalidateQueries();
      },
      onError(error) {
        toast.error(`Failed to approve`, {
          id: toastId,
        });
        console.error(error);
      },
    },
  );
}

interface DepositAndWithdrawArguments {
  signer: Signer;
  amount: string;
}

function useDeposit(vaultAddress: string) {
  const { context } = useCouncil();
  const queryClient = useQueryClient();
  let toastId: string;
  return useMutation(
    async ({
      signer,
      amount,
    }: DepositAndWithdrawArguments): Promise<string> => {
      const vault = new LockingVault(vaultAddress, context);
      const account = await signer.getAddress();
      return vault.deposit(signer, account, amount, account, {
        onSubmitted: () => (toastId = toast.loading("Depositing")),
      });
    },
    {
      onSuccess: (_, { amount }) => {
        toast.success(`Successfully deposited ${amount}!`, {
          id: toastId,
        });
        queryClient.invalidateQueries();
      },
      onError(error, { amount }) {
        toast.error(`Failed to deposit ${amount}`, {
          id: toastId,
        });
        console.error(error);
      },
    },
  );
}

function useWithdraw(vaultAddress: string) {
  const { context } = useCouncil();
  const queryClient = useQueryClient();
  let toastId: string;
  return useMutation(
    async ({
      signer,
      amount,
    }: DepositAndWithdrawArguments): Promise<string> => {
      const vault = new LockingVault(vaultAddress, context);
      return vault.withdraw(signer, amount, {
        onSubmitted: () => (toastId = toast.loading("Withdrawing")),
      });
    },
    {
      onSuccess: (_, { amount }) => {
        toast.success(`Successfully withdrew ${amount}!`, {
          id: toastId,
        });
        queryClient.invalidateQueries();
      },
      onError(error, { amount }) {
        toast.error(`Failed to withdraw ${amount}`, {
          id: toastId,
        });
        console.error(error);
      },
    },
  );
}

interface ChangeDelegateArguments {
  signer: Signer;
  delegate: string;
}

function useChangeDelegate(vaultAddress: string) {
  const { context } = useCouncil();
  const queryClient = useQueryClient();
  let toastId: string;
  return useMutation(
    ({ signer, delegate }: ChangeDelegateArguments): Promise<string> => {
      const vault = new LockingVault(vaultAddress, context);
      return vault.changeDelegate(signer, delegate, {
        onSubmitted: () => (toastId = toast.loading("Delegating")),
      });
    },
    {
      onSuccess: (_, { delegate }) => {
        toast.success(`Successfully delegated to ${formatAddress(delegate)}!`, {
          id: toastId,
        });
        queryClient.invalidateQueries();
      },
      onError(error, { delegate }) {
        toast.error(`Failed to delegate to ${formatAddress(delegate)}`, {
          id: toastId,
        });
        console.error(error);
      },
    },
  );
}
