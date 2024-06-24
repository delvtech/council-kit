import Link from "next/link";
import { ReactElement, useState } from "react";
import { makeVoterURL } from "src/routes";
import { useDisplayName } from "src/ui/base/formatting/useDisplayName";
import { Input } from "src/ui/base/forms/Input";
import { VoterAddress } from "src/ui/voters/VoterAddress";
import { zeroAddress } from "viem";
import { normalize } from "viem/ens";
import { useEnsResolver } from "wagmi";

interface ChangeDelegateFormProps {
  onDelegate: (newDelegate: `0x${string}`) => void;
  currentDelegate?: `0x${string}`;
  disabled?: boolean;
  buttonText?: string;
}

export function ChangeDelegateForm({
  currentDelegate,
  onDelegate,
  disabled,
  buttonText = "Delegate",
}: ChangeDelegateFormProps): ReactElement {
  const currentDelegateName = useDisplayName(currentDelegate);
  const isDelegateZeroAddress = currentDelegate === zeroAddress;

  const [newDelegate, setNewDelegate] = useState<string>("");
  const { data: resolvedEnsAddress } = useEnsResolver({
    name: normalize(newDelegate),
  });
  const isNotNew = newDelegate === currentDelegate;

  const newDelegateAddress =
    resolvedEnsAddress && resolvedEnsAddress !== zeroAddress
      ? resolvedEnsAddress
      : (newDelegate as `0x${string}`);

  return (
    <div className="daisy-card flex h-fit basis-1/2 flex-col gap-y-4 bg-base-200 p-4">
      <div className="text-2xl font-bold">Change Delegate</div>
      <Input
        placeholder="Address or ENS"
        value={newDelegate}
        onChange={setNewDelegate}
        disabled={disabled}
        infoText={
          <span className="flex items-center text-lg">
            <span className="mr-2">Current Delegate:</span>
            {!currentDelegate || isDelegateZeroAddress ? (
              <span className="font-bold">None</span>
            ) : (
              <Link
                href={makeVoterURL(currentDelegate)}
                className="flex items-center text-lg font-bold hover:underline"
              >
                <VoterAddress
                  address={currentDelegate}
                  ensName={currentDelegateName}
                />
              </Link>
            )}
          </span>
        }
      />
      <button
        className="daisy-btn daisy-btn-primary"
        disabled={disabled || isNotNew || !newDelegateAddress}
        onClick={() => onDelegate(newDelegateAddress!)}
      >
        {buttonText}
      </button>
    </div>
  );
}
