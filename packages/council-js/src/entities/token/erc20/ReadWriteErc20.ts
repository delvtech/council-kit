import { ReadWriteAdapter } from "@delvtech/drift";
import {
  ApproveParams,
  ReadWriteToken,
} from "src/entities/token/ReadWriteToken";
import { ReadErc20 } from "src/entities/token/erc20/ReadErc20";

export class ReadWriteErc20<A extends ReadWriteAdapter = ReadWriteAdapter>
  extends ReadErc20<A>
  implements ReadWriteToken<A>
{
  async approve({
    args: { spender, amount },
    options,
  }: ApproveParams): Promise<`0x${string}`> {
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
