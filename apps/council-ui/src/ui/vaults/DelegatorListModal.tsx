import { VoterWithPower } from "@delvtech/council-viem";
import { ReactElement } from "react";
import { formatAddress } from "src/ui/base/formatting/formatAddress";
import { WalletIcon } from "src/ui/base/WalletIcon";
import { VotersListCompact } from "src/ui/voters/VotersListCompact";

export interface DelegatorListModalProps {
  id: string;
  delegators: VoterWithPower[];
  delegateName?: string | undefined | null;
  delegateAddress: `0x${string}`;
}

export function DelegatorListModal({
  id,
  delegators,
  delegateName,
  delegateAddress,
}: DelegatorListModalProps): ReactElement {
  return (
    <>
      <input type="checkbox" id={id} className="daisy-modal-toggle" />
      <label htmlFor={id} className="daisy-modal cursor-pointer">
        <label className="daisy-modal-box relative space-y-6" htmlFor={id}>
          <h3 className="flex items-center text-xl font-bold">
            Wallets delegated to
            <WalletIcon className="mx-1 ml-2" address={delegateAddress} />
            {delegateName || formatAddress(delegateAddress)}:
          </h3>

          <div className="max-h-72 overflow-x-auto">
            <VotersListCompact voters={delegators} />
          </div>
        </label>
      </label>
    </>
  );
}
