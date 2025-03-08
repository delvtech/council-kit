import { Adapter, createDrift, Drift, ReadWriteAdapter } from "@delvtech/drift";
import { ReadCouncil } from "src/entities/council/ReadCouncil";
import { ReadWriteCouncil } from "src/entities/council/ReadWriteCouncil";
import { EntityConfig } from "src/entities/Entity";

export function createCouncil<A extends Adapter = Adapter>({
  drift,
  earliestBlock,
  ...driftConfig
}: EntityConfig<A> = {}): Council<A> {
  drift ||= createDrift(driftConfig);

  if (drift.isReadWrite()) {
    return new ReadWriteCouncil({
      drift: drift as Drift<ReadWriteAdapter>,
      earliestBlock,
    }) as Council<A>;
  }

  return new ReadCouncil({
    drift,
    earliestBlock,
  }) as Council<A>;
}

export type Council<A extends Adapter = Adapter> = A extends ReadWriteAdapter
  ? ReadWriteCouncil<A>
  : ReadCouncil<A>;
