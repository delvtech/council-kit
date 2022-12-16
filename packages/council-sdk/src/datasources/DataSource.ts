import { CouncilContext } from "src/context";

/**
 * The base DataSource interface which simply requires a context instance.
 */
export interface DataSource {
  context: CouncilContext;
}
