import { VoterWithPower } from "@council/sdk";
import { ReactElement } from "react";
import { formatAddress } from "src/ui/base/formatting/formatAddress";
import { WalletIcon } from "src/ui/base/WalletIcon";
import { VotersListCompact } from "src/ui/voters/VotersListCompact";

export interface DelegatorListModalProps {
  id: string;
  delegators: VoterWithPower[];
  delegateName?: string | undefined | null;
  delegateAddress: string;
}

export function DelegatorListModal({
  id,
  delegators,
  delegateName,
  delegateAddress,
}: DelegatorListModalProps): ReactElement {
  console.log({ delegateName, delegateAddress });
  return (
    <>
      <input type="checkbox" id={id} className="daisy-modal-toggle" />
      <label htmlFor={id} className="cursor-pointer daisy-modal">
        <label className="relative space-y-6 daisy-modal-box" htmlFor={id}>
          <h3 className="flex items-center text-xl font-bold">
            Wallets delegated to
            <WalletIcon className="mx-1 ml-2" address={delegateAddress} />
            {delegateName || formatAddress(delegateAddress)}:
          </h3>

          <div className="overflow-x-auto max-h-72">
            <VotersListCompact voters={delegators} />
          </div>
        </label>
      </label>
    </>
  );
}
