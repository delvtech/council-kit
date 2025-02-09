import { Adapter, ContractReadOptions } from "@delvtech/drift";
import { SdkClient, SdkClientConfig } from "src/drift/SdkClient";
import { ReadToken } from "src/token/ReadToken";

export class ReadEth<A extends Adapter = Adapter>
  extends SdkClient<A>
  implements ReadToken<A>
{
  static address = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" as const;
  address = ReadEth.address;

  constructor({ debugName = "ETH", ...restOptions }: SdkClientConfig<A>) {
    super({ debugName, ...restOptions });
  }

  async getName(): Promise<string> {
    return "Ethereum";
  }

  async getSymbol(): Promise<string> {
    return "ETH";
  }

  async getDecimals(): Promise<number> {
    return 18;
  }

  /**
   * @remarks
   * Native ETH does not require allowances as it is sent directly as the
   * message value when used in Hyperdrive. This method returns a maximum
   * value to indicate the absence of an allowance mechanism for ETH.
   */
  async getAllowance(): Promise<bigint> {
    // Max value for uint256
    return 2n ** 256n - 1n;
  }

  async getBalanceOf({
    account,
    options,
  }: {
    account: `0x${string}`;
    options?: ContractReadOptions;
  }): Promise<bigint> {
    return this.drift.getBalance({
      address: account,
      ...options,
    });
  }
}
