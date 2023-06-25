import { Signer } from "ethers";
import { ReactElement } from "react";
import { makeEtherscanAddressURL } from "src/etherscan/makeEtherscanAddressURL";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import ExternalLink from "src/ui/base/links/ExternalLink";
import { Stat } from "src/ui/base/Stat";
import { DefinitionTooltip } from "src/ui/base/Tooltip/Tooltip";
import { useChainId } from "src/ui/network/useChainId";
import { useSendFunds } from "src/ui/vaults/fundVault/hooks/useSendFunds";
import {
  PARTICIPANTS_TIP,
  WALLETS_DELEGATED_TIP,
  YOUR_VOTING_POWER_TIP,
} from "src/ui/vaults/tooltips";
import { useSigner } from "wagmi";

interface FundVaultStatsRowProps {
  vaultAddress: string;
  accountVotingPower: string;
  delegatedToAccount: number;
  participants: number;
  tokenAddress: string;
  tokenSymbol: string;
}

export function FundVaultStatsRow({
  vaultAddress,
  accountVotingPower,
  delegatedToAccount,
  participants,
  tokenAddress,
  tokenSymbol,
}: FundVaultStatsRowProps): ReactElement {
  const chainId = useChainId();
  const { mutate: sendFunds } = useSendFunds(vaultAddress);
  const { data: signer } = useSigner();
  // const { mutate: approve, isLoading: isApproving } = useSendFunds(address);
  return (
    <div className="flex flex-wrap gap-4">
      {accountVotingPower && (
        <Stat
          label={
            <DefinitionTooltip content={YOUR_VOTING_POWER_TIP}>
              Your voting power
            </DefinitionTooltip>
          }
          value={
            +accountVotingPower ? formatBalance(accountVotingPower) : "None"
          }
        />
      )}

      {delegatedToAccount >= 0 && (
        <Stat
          label={
            <DefinitionTooltip content={WALLETS_DELEGATED_TIP}>
              Wallets delegated to you
            </DefinitionTooltip>
          }
          value={delegatedToAccount || "None"}
        />
      )}

      {participants >= 0 && (
        <Stat
          label={
            <DefinitionTooltip content={PARTICIPANTS_TIP}>
              Participants
            </DefinitionTooltip>
          }
          value={participants}
        />
      )}

      <Stat
        label={
          <DefinitionTooltip content="The specific token native to this vault">
            Vault token
          </DefinitionTooltip>
        }
        value={
          <ExternalLink href={makeEtherscanAddressURL(tokenAddress, chainId)}>
            {tokenSymbol}
          </ExternalLink>
        }
      />
      <button
        className="daisy-btn daisy-btn-primary"
        onClick={() => sendFunds({ signer: signer as Signer })}
        // disabled={disabled || !+balance}
      >
        Send All Funds
      </button>
    </div>
  );
}
