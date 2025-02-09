import { Address, Hash, ReadWriteAdapter } from "@delvtech/drift";
import { EntityWriteParams } from "src/entities/Entity";
import { ReadToken } from "src/entities/token/ReadToken";

export class ReadWriteToken<
  A extends ReadWriteAdapter = ReadWriteAdapter,
> extends ReadToken<A> {
  async approve({
    args: { spender, amount },
    options,
  }: EntityWriteParams<{
    /**
     * The address of the spender.
     */
    spender: Address;
    /**
     * The amount of tokens the spender can spend.
     */
    amount: bigint;
  }>): Promise<Hash> {
    const owner = await this.contract.getSignerAddress();
    const hash = await this.contract.write(
      "approve",
      { spender, amount },
      {
        ...options,
        onMined: (receipt) => {
          if (receipt?.status === "success") {
            this.contract.invalidateRead("allowance", {
              owner: receipt.from,
              spender,
            });
          }
          options?.onMined?.(receipt);
        },
      },
    );
    return hash;
  }
}
