import { CouncilContext } from "src/context";

/**
 * Base model class extended by all others
 */
export class Model {
  context: CouncilContext;
  name: string;

  constructor(context: CouncilContext, name?: string) {
    this.context = context;
    this.name = name ?? this.constructor.name;
  }
}
