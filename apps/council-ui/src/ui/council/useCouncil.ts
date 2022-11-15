import { useContext } from "react";
import { CouncilClient } from "src/clients/council";
import { CouncilClientContext } from "./context";

export function useCouncil(): CouncilClient {
  return useContext(CouncilClientContext);
}
