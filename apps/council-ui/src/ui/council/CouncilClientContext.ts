import { createContext } from "react";
import { getCouncilClient } from "src/clients/council";
import { SupportedChainId } from "src/config/council.config";
import { chains } from "src/provider";

export const CouncilClientContext = createContext(
  getCouncilClient(chains[0].id as SupportedChainId),
);
