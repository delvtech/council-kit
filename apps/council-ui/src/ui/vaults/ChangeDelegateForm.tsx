import Link from "next/link";
import { ReactElement, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { makeVoterURL } from "src/routes";
import { useDisplayName } from "src/ui/base/formatting/useDisplayName";
import { Input } from "src/ui/base/forms/Input";
import { WalletIcon } from "src/ui/base/WalletIcon";

interface ChangeDelegateFormProps {
  currentDelegate: string;
  onDelegate: (delegate: string) => void;
  disabled?: boolean;
}

export function ChangeDelegateForm({
  currentDelegate,
  onDelegate,
  disabled = false,
}: ChangeDelegateFormProps): ReactElement {
  const [newDelegate, setNewDelegate] = useState("");
  const delegateName = useDisplayName(currentDelegate);

  return (
    <div className="flex flex-col p-4 basis-1/2 gap-y-4 daisy-card bg-base-300 h-fit">
      <div className="text-2xl font-bold">Change Delegate</div>
      <Input
        placeholder="Address or ENS"
        value={newDelegate}
        onChange={setNewDelegate}
        disabled={disabled}
        infoText={
          <span className="text-lg flex items-center">
            Current Delegate:{" "}
            <Link
              href={makeVoterURL(currentDelegate)}
              className="hover:underline text-lg font-bold flex items-center"
            >
              <WalletIcon address={currentDelegate} className="mx-2" />
              {delegateName}
            </Link>
          </span>
        }
      />
      <button
        className="daisy-btn daisy-btn-primary"
        onClick={() => onDelegate(newDelegate)}
        disabled={disabled}
      >
        Delegate
      </button>
    </div>
  );
}

// ================ Skeletons ================

export function ChangeDelegateFormSkeleton(): ReactElement {
  return (
    <div className="flex flex-col p-4 basis-1/2 gap-y-4 daisy-card bg-base-300 h-fit">
      <div className="text-2xl font-bold">Change Delegate</div>
      <Input
        placeholder="Address or ENS"
        value={""}
        onChange={() => {}}
        disabled={true}
        infoText={
          <span className="flex text-xl">
            Current Delegate:
            <div className="w-32 ml-1">
              <Skeleton />
            </div>
          </span>
        }
      />
      <button className="daisy-btn daisy-btn-primary" disabled={true}>
        Delegate
      </button>
    </div>
  );
}
