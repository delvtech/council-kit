import { PropsWithChildren, ReactElement, useMemo } from "react";
import { getCouncilClient } from "src/clients/council";
import { SupportedChainId } from "src/config/council.config";
import { chains } from "src/provider";
import { useNetwork } from "wagmi";
import { CouncilClientContext } from "./context";

export function CouncilClientProvider({
  children,
}: PropsWithChildren): ReactElement {
  const network = useNetwork();
  const client = useMemo(
    () =>
      getCouncilClient((network.chain?.id || chains[0].id) as SupportedChainId),
    [network],
  );
  return (
    <CouncilClientContext.Provider value={client}>
      {children}
    </CouncilClientContext.Provider>
  );
}
