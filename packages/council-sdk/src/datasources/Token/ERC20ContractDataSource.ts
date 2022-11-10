import { providers, Signer } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { ContractDataSource } from "src/datasources/ContractDataSource";
import { TokenDataSource } from "./TokenDataSource";
import { MockERC20, MockERC20__factory } from "@elementfi/council-typechain";

export class ERC20ContractDataSource
  extends ContractDataSource<MockERC20>
  implements TokenDataSource
{
  constructor(address: string, provider: providers.Provider) {
    super(MockERC20__factory.connect(address, provider));
  }

  getSymbol(): Promise<string> {
    return this.call("symbol", []);
  }

  getDecimals(): Promise<number> {
    return this.call("decimals", []);
  }

  getName(): Promise<string> {
    return this.call("name", []);
  }

  async getBalanceOf(address: string): Promise<string> {
    const balanceBigNumber = await this.call("balanceOf", [address]);
    const decimals = await this.getDecimals();
    return formatUnits(balanceBigNumber, decimals);
  }

  async getAllowance(owner: string, spender: string): Promise<string> {
    const balanceBigNumber = await this.call("allowance", [owner, spender]);
    const decimals = await this.getDecimals();
    return formatUnits(balanceBigNumber, decimals);
  }

  /**
   * Sets approval of token access up to a certain amount
   * @param {Signer} signer - Signer.
   * @param {string} spender - Address to approve access to.
   * @param {string} [amount] - Amount approved for, defaults to maximum.
   * @return {Promise<boolean>} successful - Boolean denoting a successful approval.
   */
  async approve(
    signer: Signer,
    spender: string,
    amount: string,
  ): Promise<boolean> {
    const token = this.contract.connect(signer);
    const transaction = await token.approve(
      spender,
      parseUnits(amount, await this.getDecimals()),
    );
    await transaction.wait(); // will throw an error if transaction fails
    const owner = await signer.getAddress();
    this.deleteCall("allowance", [owner, spender]);
    return true;
  }
}
