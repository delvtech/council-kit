import { createCouncil } from "@delvtech/council-js";
import { SupportedChainId } from "src/config/council.config";
import { getDrift } from "src/lib/drift";

export function getCouncil(chainId: SupportedChainId) {
  return createCouncil({
    drift: getDrift({ chainId }),
  });
}
