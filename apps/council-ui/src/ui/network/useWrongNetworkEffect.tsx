import { useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { chains } from "src/provider";
import { useChainId } from "src/ui/network/useChainId";
import { useNetwork } from "wagmi";

export function useWrongNetworkEffect(): void {
  const { chain: connectedChain } = useNetwork();
  const usedChainId = useChainId();
  const toastIdRef = useRef<string | void>();

  useEffect(() => {
    if (connectedChain && !chains.find(({ id }) => id === connectedChain.id)) {
      if (!toastIdRef.current) {
        const usedChain = chains.find(({ id }) => id === usedChainId);
        toastIdRef.current = toast.error(
          `Wrong network!${
            usedChain ? `\nShowing data for ${usedChain.name}.` : ""
          }`,
          {
            duration: Infinity,
          },
        );
      }
    } else {
      if (toastIdRef.current) {
        toastIdRef.current = toast.dismiss(toastIdRef.current);
      }
    }
  }, [connectedChain, usedChainId]);
}
