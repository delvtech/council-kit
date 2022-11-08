import { ethers, providers, Signer } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { ContractDataSource } from "src/datasources/ContractDataSource";
import { TokenDataSource } from "./TokenDataSource";
import { MockERC20, MockERC20__factory } from "@elementfi/council-typechain";

export class ERC20ContractDataSource implements TokenDataSource {
  address: string;
  contract: ContractDataSource<MockERC20>;

  constructor(
    address: string,
    provider: providers.Provider,
    contract?: ContractDataSource<MockERC20>,
  ) {
    this.address = address;
    this.contract =
      contract ||
      new ContractDataSource(MockERC20__factory.connect(address, provider));
  }

  getSymbol(): Promise<string> {
    return this.contract.call("symbol", []);
  }

  getDecimals(): Promise<number> {
    return this.contract.call("decimals", []);
  }

  getName(): Promise<string> {
    return this.contract.call("name", []);
  }

  async getAllowance(owner: string, spender: string): Promise<string> {
    const balanceBigNumber = await this.contract.call("allowance", [
      owner,
      spender,
    ]);
    const decimals = await this.getDecimals();
    return formatUnits(balanceBigNumber, decimals);
  }

  async getBalanceOf(address: string): Promise<string> {
    const balanceBigNumber = await this.contract.call("balanceOf", [address]);
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
    const token = this.contract.contract.connect(signer);
    const transaction = await token.approve(
      spender,
      parseUnits(amount, await this.getDecimals()),
    );
    await transaction.wait(); // will throw an error if transaction fails
    return true;
  }
}
