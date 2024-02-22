import { XMarkIcon } from "@heroicons/react/20/solid";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useSupportedChainId } from "src/ui/network/hooks/useSupportedChainId";
import { useChainId, usePublicClient } from "wagmi";

const TOAST_ID = "wrong-network";

export function useWrongNetworkEffect(): void {
  const client = usePublicClient();
  const connectedChain = useChainId();
  const usedChainId = useSupportedChainId();

  const chainName = client?.chain.name;

  useEffect(() => {
    if (connectedChain !== usedChainId) {
      toast.error(
        <div className="flex items-center gap-4">
          <div>
            <p>Wrong network!</p>
            {chainName && <p>Showing data for {chainName}</p>}
          </div>
          <button
            onClick={() => toast.dismiss(TOAST_ID)}
            className="group daisy-btn daisy-btn-circle daisy-btn-ghost daisy-btn-sm"
          >
            <XMarkIcon className="w-5 opacity-50 transition-all group-hover:opacity-100" />
          </button>
        </div>,
        {
          position: "bottom-center",
          duration: Infinity,
          id: TOAST_ID,
        },
      );
    } else {
      toast.dismiss(TOAST_ID);
    }
  }, [connectedChain, usedChainId, chainName]);
}
