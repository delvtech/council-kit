import { XMarkIcon } from "@heroicons/react/20/solid";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { chains } from "src/provider";
import { useChainId } from "src/ui/network/useChainId";
import { useNetwork } from "wagmi";

const TOAST_ID = "wrong-network";

export function useWrongNetworkEffect(): void {
  const { chain: connectedChain } = useNetwork();
  const usedChainId = useChainId();

  useEffect(() => {
    if (connectedChain && !chains.find(({ id }) => id === connectedChain.id)) {
      const usedChain = chains.find(({ id }) => id === usedChainId);
      toast.error(
        <div className="flex gap-4 items-center">
          <div>
            <p>Wrong network!</p>
            {usedChain && <p>Showing data for {usedChain.name}</p>}
          </div>
          <button
            onClick={() => toast.dismiss(TOAST_ID)}
            className="daisy-btn daisy-btn-circle daisy-btn-sm daisy-btn-ghost group"
          >
            <XMarkIcon className="w-5 opacity-50 group-hover:opacity-100 transition-all" />
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
  }, [connectedChain, usedChainId]);
}
