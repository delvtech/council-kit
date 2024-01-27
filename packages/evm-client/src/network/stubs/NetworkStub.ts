import { GetBlockParameters, Network } from "src/network/Network";
import { SinonStub, stub } from "sinon";

/**
 * A mock implementation of a `Network` designed to facilitate unit
 * testing.
 */
export class NetworkStub implements Network {
  protected getBlockStub:
    | SinonStub<
        [GetBlockParameters | undefined],
        Promise<{ blockNumber: bigint; timestamp: bigint }>
      >
    | undefined;
  constructor() {}

  stubGetBlock({
    args,
    value,
  }: {
    args?: GetBlockParameters | undefined;
    value: Promise<{ blockNumber: bigint; timestamp: bigint }>;
  }): void {
    if (!this.getBlockStub) {
      this.getBlockStub = stub();
    }

    // Account for dynamic args if provided
    if (args) {
      this.getBlockStub.withArgs(args).resolves(value as any);
      return;
    }

    this.getBlockStub.resolves(value as any);
  }

  getBlock = stub().callsFake(
    (
      args?: GetBlockParameters | undefined,
    ): Promise<{ blockNumber: bigint; timestamp: bigint }> => {
      if (!this.getBlockStub) {
        throw new Error(
          `The getBlock function must be stubbed first:\n\tcontract.stubGetBlock()`,
        );
      }
      return this.getBlockStub(args);
    },
  );
}
