import { useContext } from "react";
import { CouncilClient } from "src/clients/council";
import { CouncilClientContext } from "./CouncilClientContext";

export function useCouncil(): CouncilClient {
  return useContext(CouncilClientContext);
}
