import { CouncilContext } from "src/context";

/**
 * @category Models
 */
export interface ModelOptions {
  /**
   * An arbitrary name for the instance. This is for convenience only and has no
   * affect on the model's behavior.
   */
  name?: string;
}

/**
 * Base model class extended by all others
 * @category Models
 */
export class Model {
  context: CouncilContext;
  name: string;

  constructor(context: CouncilContext, options?: ModelOptions) {
    this.context = context;
    this.name = options?.name ?? this.constructor.name;
  }
}
