import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { chains } from "src/provider";
import { useChainId } from "src/ui/network/useChainId";
import { useNetwork } from "wagmi";

export function useWrongNetworkEffect(): void {
  const { chain: connectedChain } = useNetwork();
  const usedChainId = useChainId();

  useEffect(() => {
    if (connectedChain && !chains.find(({ id }) => id === connectedChain.id)) {
      const usedChain = chains.find(({ id }) => id === usedChainId);
      toast.error(
        `Wrong network!${
          usedChain ? `\nShowing data for ${usedChain.name}.` : ""
        }`,
        {
          position: "bottom-center",
          duration: Infinity,
          id: "wrong-network",
        },
      );
    } else {
      toast.dismiss("wrong-network");
    }
  }, [connectedChain, usedChainId]);
}
