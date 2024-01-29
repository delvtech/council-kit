import { SinonStub, stub } from "sinon";
import { GetBlockOptions, Network } from "src/network/Network";
import { Transaction } from "src/network/Transaction";

/**
 * A mock implementation of a `Network` designed to facilitate unit
 * testing.
 */
export class NetworkStub implements Network {
  protected getBlockStub:
    | SinonStub<
        [GetBlockOptions | undefined],
        Promise<{ blockNumber: bigint; timestamp: bigint }>
      >
    | undefined;
  protected getTransactionStub:
    | SinonStub<
        [{ hash: `0x${string}` } | undefined],
        Promise<Transaction>
      >
    | undefined;

  constructor() {}

  stubGetBlock({
    args,
    value,
  }: {
    args?: GetBlockOptions | undefined;
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

  stubGetTransaction({
    args,
    value,
  }: {
    args?: { hash: `0x${string}` };
    value: Promise<Transaction>;
  }): void {
    if (!this.getTransactionStub) {
      this.getTransactionStub = stub();
    }

    // Account for dynamic args if provided
    if (args) {
      this.getTransactionStub.withArgs(args).resolves(value as any);
      return;
    }

    this.getTransactionStub.resolves(value as any);
  }

  getBlock = stub().callsFake(
    (
      args?: GetBlockOptions | undefined,
    ): Promise<{ blockNumber: bigint; timestamp: bigint }> => {
      if (!this.getBlockStub) {
        throw new Error(
          `The getBlock function must be stubbed first:\n\tcontract.stubGetBlock()`,
        );
      }
      return this.getBlockStub(args);
    },
  );

  getTransaction = stub().callsFake(
    (args?: { hash: `0x${string}` }): Promise<Transaction> => {
      if (!this.getTransactionStub) {
        throw new Error(
          `The getTransaction function must be stubbed first:\n\tcontract.stubGetTransaction()`,
        );
      }
      return this.getTransactionStub(args);
    },
  );
}
