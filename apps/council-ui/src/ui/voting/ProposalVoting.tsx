import { Ballot } from "@council/sdk";
import classNames from "classnames";
import { ReactElement } from "react";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import useVotingPowerByVault from "src/ui/vaults/hooks/useVotingPowerByVault";

interface ProposalVotingProps {
  atBlock: number | undefined;
  account: string | undefined;
  onVote: (ballot: Ballot) => void;
  disabled?: boolean;
  accountBallot?: Ballot | null;
}

export default function ProposalVoting({
  atBlock,
  account,
  onVote,
  disabled,
  accountBallot,
}: ProposalVotingProps): ReactElement {
  const { data: votingPowerByVault } = useVotingPowerByVault(account, atBlock);

  const totalVotingPower = votingPowerByVault?.reduce(
    (total, vault) => total + +vault.votingPower,
    0,
  );

  return (
    <div className="flex flex-col gap-y-4">
      <h2 className="text-2xl text-accent-content">Your Vote</h2>
      <div className="flex">
        <h3 className="text-xl">Vaults</h3>
        <h3 className="text-xl ml-auto">Voting Power</h3>
      </div>
      <div className="flex max-h-64 flex-col gap-y-4 overflow-y-auto pr-2">
        {votingPowerByVault?.map((vault) => (
          <div className="flex" key={vault.name}>
            <h3>{vault.name}</h3>
            <p className="ml-auto">{formatBalance(vault.votingPower)}</p>
          </div>
        ))}
      </div>

      <div className="flex">
        <h2 className="text-xl text-accent-content">Total Voting Power</h2>
        <p className="ml-auto text-xl font-bold text-accent-content pr-2">
          {formatBalance(totalVotingPower ?? 0)}
        </p>
      </div>

      <div className="daisy-btn-group m-auto">
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
