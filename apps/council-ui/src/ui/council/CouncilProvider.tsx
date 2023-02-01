import { PropsWithChildren, ReactElement, useMemo } from "react";
import { getCouncilClient } from "src/clients/council";
import { useChainId } from "src/ui/network/useChainId";
import { CouncilClientContext } from "./CouncilClientContext";

export function CouncilClientProvider({
  children,
}: PropsWithChildren): ReactElement {
  const chainId = useChainId();
  const client = useMemo(() => getCouncilClient(chainId), [chainId]);
  return (
    <CouncilClientContext.Provider value={client}>
      {children}
    </CouncilClientContext.Provider>
  );
}
