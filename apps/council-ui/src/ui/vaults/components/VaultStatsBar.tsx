import { ReactElement } from "react";
import Skeleton from "react-loading-skeleton";
import { makeEtherscanAddressURL } from "src/lib/etherscan/makeEtherscanAddressURL";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import ExternalLink from "src/ui/base/links/ExternalLink";

interface VaultStatsBarProps {
  activeProposalCount: number;
  accountVotingPower: string;
  accountPercentOfTVP: number;
  delegatedToAccount: number;
  participants: number;
  tokenAddress: string;
  tokenSymbol: string;
}

export function VaultStatsBar({
  activeProposalCount,
  accountVotingPower,
  accountPercentOfTVP,
  delegatedToAccount,
  participants,
  tokenAddress,
  tokenSymbol,
}: VaultStatsBarProps): ReactElement {
  return (
    <div className="flex flex-wrap gap-4">
      {activeProposalCount >= 0 && (
        <div className="daisy-stats">
          <div className="daisy-stat bg-base-300">
            <div className="daisy-stat-title">Active Proposals</div>
            <div className="text-sm daisy-stat-value">
              {activeProposalCount}
            </div>
          </div>
        </div>
      )}

      {accountVotingPower && (
        <div className="daisy-stats">
          <div className="daisy-stat bg-base-300">
            <div className="daisy-stat-title">Your Voting Power</div>
            <div className="text-sm daisy-stat-value">
              {formatBalance(accountVotingPower)}
            </div>
          </div>
        </div>
      )}

      {accountPercentOfTVP >= 0 && (
        <div className="daisy-stats">
          <div className="daisy-stat bg-base-300">
            <div className="daisy-stat-title">% of Total TVP</div>
            <div className="text-sm daisy-stat-value">
              {formatBalance(accountPercentOfTVP, 2)}%
            </div>
          </div>
        </div>
      )}

      {delegatedToAccount >= 0 && (
        <div className="daisy-stats">
          <div className="daisy-stat bg-base-300">
            <div className="daisy-stat-title">Delegated to You</div>
            <div className="text-sm daisy-stat-value">{delegatedToAccount}</div>
          </div>
        </div>
      )}

      {participants >= 0 && (
        <div className="daisy-stats">
          <div className="daisy-stat bg-base-300">
            <div className="daisy-stat-title">Participants</div>
            <div className="text-sm daisy-stat-value">{participants}</div>
          </div>
        </div>
      )}

      <div className="daisy-stats">
        <div className="daisy-stat bg-base-300">
          <div className="daisy-stat-title">Vault token</div>
          <div className="text-sm daisy-stat-value">
            <ExternalLink href={makeEtherscanAddressURL(tokenAddress)}>
              {tokenSymbol}
            </ExternalLink>
          </div>
        </div>
      </div>
    </div>
  );
}

// ================ Skeletons ================

export function VaultStatsBarSkeleton(): ReactElement {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="daisy-stats">
        <div className="daisy-stat bg-base-300">
          <div className="daisy-stat-title">Active Proposals</div>
          <div className="text-sm daisy-stat-value">
            <Skeleton width={90} />
          </div>
        </div>
      </div>

      <div className="daisy-stats">
        <div className="daisy-stat bg-base-300">
          <div className="daisy-stat-title">Your Voting Power</div>
          <div className="text-sm daisy-stat-value">
            <Skeleton width={90} />
          </div>
        </div>
      </div>

      <div className="daisy-stats">
        <div className="daisy-stat bg-base-300">
          <div className="daisy-stat-title">% of Total TVP</div>
          <div className="text-sm daisy-stat-value">
            <Skeleton width={90} />
          </div>
        </div>
      </div>

      <div className="daisy-stats">
        <div className="daisy-stat bg-base-300">
          <div className="daisy-stat-title">Delegated to You</div>
          <div className="text-sm daisy-stat-value">
            <Skeleton width={90} />
          </div>
        </div>
      </div>

      <div className="daisy-stats">
        <div className="daisy-stat bg-base-300">
          <div className="daisy-stat-title">Participants</div>
          <div className="text-sm daisy-stat-value">
            <Skeleton width={90} />
          </div>
        </div>
      </div>

      <div className="daisy-stats">
        <div className="daisy-stat bg-base-300">
          <div className="daisy-stat-title">Vault token</div>
          <div className="text-sm daisy-stat-value">
            <Skeleton width={90} />
          </div>
        </div>
      </div>
    </div>
  );
}
