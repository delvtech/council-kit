import { Ballot } from "@council/sdk";
import classNames from "classnames";
import { ReactElement } from "react";
import Skeleton from "react-loading-skeleton";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import useVotingPowerByVault from "src/ui/vaults/hooks/useVotingPowerByVault";

interface ProposalVotingProps {
  account: string | undefined;
  accountBallot?: Ballot | null;
  atBlock: number | undefined;
  disabled?: boolean;
  onVote: (ballot: Ballot) => void;
}

export function ProposalVoting({
  account,
  accountBallot,
  atBlock,
  disabled,
  onVote,
}: ProposalVotingProps): ReactElement {
  const { data: votingPowerByVault } = useVotingPowerByVault(account, atBlock);

  const totalVotingPower = votingPowerByVault?.reduce(
    (total, vault) => total + +vault.votingPower,
    0,
  );

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex">
        <h3 className="text-lg font-medium">Vaults</h3>
        <h3 className="ml-auto text-lg font-medium">Voting Power</h3>
      </div>
      <div className="flex flex-col overflow-y-auto max-h-64 gap-y-4">
        {votingPowerByVault?.map((vault) => (
          <div className="flex" key={vault.name}>
            <h3>{vault.name}</h3>
            <p className="ml-auto">{formatBalance(vault.votingPower)}</p>
          </div>
        ))}
      </div>

      <div className="flex">
        <h2 className="text-lg">Total Voting Power</h2>
        <p className="ml-auto text-lg font-bold">
          {formatBalance(totalVotingPower ?? 0)}
        </p>
      </div>

      <div className="m-auto daisy-btn-group">
        <button
          className={classNames("daisy-btn daisy-btn-lg", {
            "daisy-btn-active": accountBallot === "yes",
          })}
          onClick={() => onVote("yes")}
          disabled={disabled}
        >
          YES
        </button>
        <button
          className={classNames("daisy-btn daisy-btn-lg", {
            "daisy-btn-active": accountBallot === "no",
          })}
          onClick={() => onVote("no")}
          disabled={disabled}
        >
          NO
        </button>
        <button
          className={classNames("daisy-btn daisy-btn-lg", {
            "daisy-btn-active": accountBallot === "maybe",
          })}
          onClick={() => onVote("maybe")}
          disabled={disabled}
        >
          ABSTAIN
        </button>
      </div>
    </div>
  );
}

// ================ Skeletons ================

export function ProposalVotingSkeleton(): ReactElement {
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex">
        <h3 className="text-lg font-medium">Vaults</h3>
        <h3 className="ml-auto text-lg font-medium">Voting Power</h3>
      </div>
      <div className="flex flex-col overflow-y-auto max-h-64 gap-y-4">
        <div className="flex">
          <h3 className="w-32">
            <Skeleton />
          </h3>
          <p className="w-24 ml-auto">
            <Skeleton />
          </p>
        </div>

        <div className="flex">
          <h3 className="w-32">
            <Skeleton />
          </h3>
          <p className="w-24 ml-auto">
            <Skeleton />
          </p>
        </div>

        <div className="flex">
          <h3 className="w-32">
            <Skeleton />
          </h3>
          <p className="w-24 ml-auto">
            <Skeleton />
          </p>
        </div>
      </div>

      <div className="flex">
        <h2 className="text-lg">Total Voting Power</h2>
        <p className="ml-auto text-lg font-bold">
          <Skeleton />
        </p>
      </div>

      <div className="m-auto daisy-btn-group">
        <button className="daisy-btn daisy-btn-lg" disabled={true}>
          YES
        </button>
        <button className="daisy-btn daisy-btn-lg" disabled={true}>
          NO
        </button>
        <button className="daisy-btn daisy-btn-lg" disabled={true}>
          ABSTAIN
        </button>
      </div>
    </div>
  );
}
