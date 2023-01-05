import { ReactElement, useState } from "react";
import { useDisplayName } from "src/ui/base/formatting/useDisplayName";
import { Input } from "src/ui/base/forms/Input";

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
          <span className="text-lg">
            Current Delegate:{" "}
            <span className="text-lg font-bold">{delegateName}</span>
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
