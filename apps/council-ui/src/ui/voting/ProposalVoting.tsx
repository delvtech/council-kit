import { ReactElement } from "react";
import useVotingPowerByVault from "src/ui/vaults/hooks/useVotingPowerByVault";

export default function ProposalVoting({
  account,
}: {
  account: string | undefined;
}): ReactElement {
  const { data: votingPowerByVault } = useVotingPowerByVault(account);
  const totalVotingPower = votingPowerByVault?.reduce(
    (total, vault) => total + +vault.votingPower,
    0,
  );

  return (
    <div className="flex flex-col gap-y-4">
      <h2 className="text-2xl text-accent-content">Your Vote</h2>
      <div className="flex">
        <h3>Vaults</h3>
        <h3 className="ml-auto">Voting Power</h3>
      </div>
      <div className="flex max-h-64 flex-col gap-y-3 overflow-y-auto pr-8">
        {votingPowerByVault?.map((vault) => (
          <div className="flex" key={vault.name}>
            <h3 className="underline">{vault.name}</h3>
            <h3 className="ml-auto">{vault.votingPower}</h3>
          </div>
        ))}
      </div>

      <div className="flex">
        <h2 className="text-lg text-accent-content">Total Voting Power</h2>
        <h2 className="ml-auto text-lg font-bold text-accent-content">
          {totalVotingPower}
        </h2>
      </div>

      {/* TODO voting actions just skeleton for now */}
      <div className="daisy-btn-group m-auto">
        <button className="daisy-btn daisy-btn-active daisy-btn-lg">YES</button>
        <button className="daisy-btn daisy-btn-lg">NO</button>
        <button className="daisy-btn daisy-btn-lg">ABSTAIN</button>
      </div>
    </div>
  );
}
