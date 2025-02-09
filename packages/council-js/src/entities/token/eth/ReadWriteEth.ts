import { ReadWriteAdapter } from "@delvtech/drift";
import { HyperdriveSdkError } from "src/HyperdriveSdkError";
import { ReadEth } from "src/token/eth/ReadEth";
import { ReadWriteToken } from "src/token/ReadWriteToken";

export class ReadWriteEth<A extends ReadWriteAdapter = ReadWriteAdapter>
  extends ReadEth<A>
  implements ReadWriteToken<A>
{
  /**
   * This method is not available for the native ETH token.
   * @throws {HyperdriveSdkError}
   */
  async approve(): Promise<`0x${string}`> {
    throw new HyperdriveSdkError(
      "This method is not available for the native ETH token.",
    );
  }
}
