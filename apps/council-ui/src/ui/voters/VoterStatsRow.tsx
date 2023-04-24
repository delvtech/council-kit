import { ReactElement } from "react";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { Stat } from "src/ui/base/Stat";
import { ExternalLinkSVG } from "src/ui/base/svg/ExternalLink";
import { DefinitionTooltip } from "src/ui/base/Tooltip/Tooltip";
import { GSCStatus } from "src/vaults/gscVault/types";

interface VoterStatsRowProps {
  gscStatus: GSCStatus | null;
  proposalsCreated: number;
  proposalsVoted: number;
  votingPower: string;
  percentOfTVP: number;
  karmaProfile?: {
    name: string;
    url: string;
  };
}

export function VoterStatsRow({
  gscStatus,
  proposalsCreated,
  proposalsVoted,
  votingPower,
  percentOfTVP,
  karmaProfile,
}: VoterStatsRowProps): ReactElement {
  let percentOfTVPLabel = percentOfTVP > 0.1 ? `${percentOfTVP}%` : "< 0.1%";
  if (!percentOfTVP) {
    percentOfTVPLabel = "0";
  }
  return (
    <div className="flex flex-wrap gap-4">
      <Stat label="Voting Power" value={formatBalance(votingPower, 0)} />
      <Stat
        label={
          <span>
            % of{" "}
            <DefinitionTooltip content="Total voting power from all voters.">
              TVP
            </DefinitionTooltip>
          </span>
        }
        value={percentOfTVPLabel}
      />
      <Stat label="Proposals voted" value={proposalsVoted} />
      <Stat label="Proposals created" value={proposalsCreated} />
      {gscStatus && <Stat label="GSC Member" value={gscStatus} />}
      {karmaProfile && (
        <Stat
          label="Karma Stats"
          value={
            <a
              href={karmaProfile.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center"
            >
              {karmaProfile.name}
              <ExternalLinkSVG />
            </a>
          }
        />
        // <div className="daisy-stats">
        //   <div className="daisy-stat bg-[#222432] text-[#C7CADF]">
        //     <div className="daisy-stat-title text-[#C7CADF] opacity-100">Profile</div>
        //     <div className="text-sm daisy-stat-value">
        //       <a
        //         href={karmaProfile}
        //         target="_blank"
        //         rel="noreferrer"
        //         className="flex items-center gap-1"
        //       >
        //         <Image
        //           src="/karma-logo-dark.svg"
        //           alt="Karma"
        //           width={64}
        //           height={16}
        //         />
        //         <ExternalLinkSVG />
        //       </a>
        //     </div>
        //   </div>
        // </div>
      )}
    </div>
  );
}
