import { ethers } from "ethers";
import Link from "next/link";
import { ReactElement, useState } from "react";
import { makeVoterURL } from "src/routes";
import { useDisplayName } from "src/ui/base/formatting/useDisplayName";
import { Input } from "src/ui/base/forms/Input";
import { VoterAddress } from "src/ui/voters/VoterAddress";

interface ChangeDelegateFormProps {
  currentDelegate: string;
  onDelegate: (delegate: string) => void;
  depositedBalance: string;
  disabled?: boolean;
  buttonText?: string;
}

export function ChangeDelegateForm({
  currentDelegate,
  onDelegate,
  disabled,
  buttonText = "Delegate",
}: ChangeDelegateFormProps): ReactElement {
  const [newDelegate, setNewDelegate] = useState("");
  const delegateName = useDisplayName(currentDelegate);
  const isDelegateZeroAddress =
    currentDelegate === ethers.constants.AddressZero;

  const isNotNew = newDelegate === currentDelegate;

  return (
    <div className="flex flex-col p-4 basis-1/2 gap-y-4 daisy-card bg-base-200 h-fit">
      <div className="text-2xl font-bold">Change Delegate</div>
      <Input
        placeholder="Address or ENS"
        value={newDelegate}
        onChange={setNewDelegate}
        disabled={disabled}
        infoText={
          <span className="text-lg flex items-center">
            <span className="mr-2">Current Delegate:</span>
            {isDelegateZeroAddress ? (
              <span className="font-bold">None</span>
            ) : (
              <Link
                href={makeVoterURL(currentDelegate)}
                className="hover:underline text-lg font-bold flex items-center"
              >
                <VoterAddress
                  address={currentDelegate}
                  ensName={delegateName}
                />
              </Link>
            )}
          </span>
        }
      />
      <button
        className="daisy-btn daisy-btn-primary"
        onClick={() => onDelegate(newDelegate)}
        disabled={disabled || isNotNew}
      >
        {buttonText}
      </button>
    </div>
  );
}
