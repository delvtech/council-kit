import { CouncilContext } from "src/context/context";
import { DataSource } from "src/datasources/base/DataSource";

export class MockDataSource implements DataSource {
  id: number;
  context: CouncilContext;

  constructor(id: number, context: CouncilContext) {
    this.id = id;
    this.context = context;
  }
}
