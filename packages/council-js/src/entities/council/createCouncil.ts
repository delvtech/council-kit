import { Adapter, createDrift, ReadWriteAdapter } from "@delvtech/drift";
import { ReadCouncil } from "src/entities/council/ReadCouncil";
import { ReadWriteCouncil } from "src/entities/council/ReadWriteCouncil";
import { EntityConfig } from "src/entities/Entity";

export function createCouncil<A extends Adapter = Adapter>({
  drift: _drift,
  earliestBlock,
  ...driftConfig
}: EntityConfig<A> = {}): Council<A> {
  const drift = _drift || createDrift(driftConfig);

  if (drift.isReadWrite()) {
    return new ReadWriteCouncil({
      drift: drift as any,
      earliestBlock,
    }) as any;
  }

  return new ReadCouncil({
    drift,
    earliestBlock,
  }) as any;
}

export type Council<A extends Adapter = Adapter> = A extends ReadWriteAdapter
  ? ReadWriteCouncil<A>
  : ReadCouncil<A>;
