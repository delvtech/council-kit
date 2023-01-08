import { BigNumber, Signer } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import {
  ContractDataSource,
  TransactionOptions,
} from "src/datasources/ContractDataSource";
import { TokenDataSource } from "./TokenDataSource";
import { MockERC20, MockERC20__factory } from "@council/typechain";
import { CouncilContext } from "src/context";

/**
 * @category Data Sources
 */
export class ERC20ContractDataSource
  extends ContractDataSource<MockERC20>
  implements TokenDataSource
{
  constructor(address: string, context: CouncilContext) {
    super(MockERC20__factory.connect(address, context.provider), context);
  }

  /**
   * Get the name of this token.
   */
  getName(): Promise<string> {
    return this.call("name", []);
  }

  /**
   * Get the symbol of this token, usually a shorter version of the name.
   */
  getSymbol(): Promise<string> {
    return this.call("symbol", []);
  }

  /**
   * Get the number of decimals used to format a balance for display. For
   * example, if decimals equals 2, a balance of `505` tokens should be
   * displayed as `5.05` (`505 / 10 ** 2`).
   */
  getDecimals(): Promise<number> {
    return this.call("decimals", []);
  }

  /**
   * Get the amount of tokens owned by a given address.
   */
  async getBalanceOf(address: string): Promise<string> {
    const balanceBigNumber = await this.call("balanceOf", [address]);
    const decimals = await this.getDecimals();
    return formatUnits(balanceBigNumber, decimals);
  }

  /**
   * Get the spending allowance of a given spender for a given owner of this
   * token.
   */
  async getAllowance(owner: string, spender: string): Promise<string> {
    const balanceBigNumber = await this.call("allowance", [owner, spender]);
    const decimals = await this.getDecimals();
    return formatUnits(balanceBigNumber, decimals);
  }

  /**
   * Sets approval of token access up to a certain amount
   * @param signer - Signer.
   * @param spender - Address to approve access to.
   * @param amount - Amount approved for, defaults to maximum.
   * @return - The transaction hash.
   */
  async approve(
    signer: Signer,
    spender: string,
    amount: BigNumber,
    options?: TransactionOptions,
  ): Promise<string> {
    const transaction = await this.callWithSigner(
      "approve",
      [spender, amount],
      signer,
      options,
    );
    const owner = await signer.getAddress();
    this.deleteCall("allowance", [owner, spender]);
    return transaction.hash;
  }
}
