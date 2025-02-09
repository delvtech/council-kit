import { Adapter, ContractReadOptions } from "@delvtech/drift";
import { Entity } from "src/entities/Entity";
import { ReadToken } from "src/entities/token/ReadToken";

export class ReadEth<A extends Adapter = Adapter>
  extends Entity<A>
  implements ReadToken<A>
{
  static address = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" as const;
  address = ReadEth.address;

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
