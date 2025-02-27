import { createCouncil } from "@delvtech/council-js";
import { GetPublicClientParameters } from "@wagmi/core";
import { getDrift } from "src/lib/drift";

export function getCouncil(params?: GetPublicClientParameters) {
  return createCouncil({
    drift: getDrift(params),
  });
}
