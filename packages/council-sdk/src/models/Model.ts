import { CouncilContext } from "src/context/context";

/**
 * @category Models
 */
export interface ModelOptions {
  /**
   * An arbitrary name for the instance. This is for convenience only (e.g.,
   * display name, debugging) and has no affect on the model's behavior.
   */
  name?: string;
}

/**
 * Base model class extended by all others
 * @category Models
 */
export class Model {
  // TODO: Remove hard requirement on context or create default from a lighter
  // argument like provider or rpcUrl.
  context: CouncilContext;
  name: string;

  constructor(context: CouncilContext, options?: ModelOptions) {
    this.context = context;
    this.name = options?.name ?? this.constructor.name;
  }
}
