import { ReactElement, useState } from "react";
import { Input } from "src/ui/base/forms/Input";

interface ChangeDelegateFormProps {
  currentDelegate: string;
  onDelegate: (delegate: string) => void;
}

export function ChangeDelegateForm({
  currentDelegate,
  onDelegate,
}: ChangeDelegateFormProps): ReactElement {
  const [newDelegate, setNewDelegate] = useState("");

  return (
    <div className="flex basis-1/2 flex-col gap-y-4">
      <div className="text-2xl font-bold">Change Delegate</div>
      <Input
        placeholder="Address or ENS"
        value={newDelegate}
        onChange={setNewDelegate}
        infoText={`Current Delegate: ${currentDelegate}`}
      />
      <button
        className="daisy-btn daisy-btn-primary"
        onClick={() => onDelegate(newDelegate)}
      >
        Delegate
      </button>
    </div>
  );
}
