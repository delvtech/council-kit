import { CouncilContext } from "src/context";

export interface DataSource extends Record<string, any> {
  context: CouncilContext;
}
