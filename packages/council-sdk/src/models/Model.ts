import { CouncilContext } from "src/context";

export class Model {
  context: CouncilContext;
  name: string;

  constructor(context: CouncilContext, name?: string) {
    this.context = context;
    this.name = name ?? this.constructor.name;
  }
}
