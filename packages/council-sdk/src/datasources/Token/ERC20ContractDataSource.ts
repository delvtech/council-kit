import { ethers, providers, Signer } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { ContractDataSource } from "src/datasources/ContractDataSource";
import { TokenAPIDataSource } from "src/datasources/TokenAPI/TokenAPIDataSource";
import { CoinGeckoAPIDataSource } from "src/datasources/TokenAPI/CoinGeckoAPIDataSource";
import { TokenDataSource } from "./TokenDataSource";
import { MockERC20, MockERC20__factory } from "@elementfi/council-typechain";

export class ERC20ContractDataSource implements TokenDataSource {
  address: string;
  apiDataSource: TokenAPIDataSource;
  erc20DataSource: ContractDataSource<MockERC20>;

  constructor(
    address: string,
    provider: providers.Provider,
    options?: {
      apiDataSource?: TokenAPIDataSource;
      erc20DataSource?: ContractDataSource<MockERC20>;
    },
  ) {
    this.address = address;
    this.apiDataSource = options?.apiDataSource ?? new CoinGeckoAPIDataSource();
    this.erc20DataSource =
      options?.erc20DataSource ??
      new ContractDataSource(MockERC20__factory.connect(address, provider));
  }

  getSymbol(): Promise<string> {
    return this.erc20DataSource.call("symbol", []);
  }

  getDecimals(): Promise<number> {
    return this.erc20DataSource.call("decimals", []);
  }

  getName(): Promise<string> {
    return this.erc20DataSource.call("name", []);
  }

  async getPrice(currency: string): Promise<number | null> {
    // TODO: find a more reliable way to get the id
    const id = (await this.getName()).toLowerCase();
    return this.apiDataSource.getTokenPrice(id, currency);
  }

  async getAllowance(owner: string, spender: string): Promise<string> {
    const balanceBigNumber = await this.erc20DataSource.call("allowance", [
      owner,
      spender,
    ]);
    const decimals = await this.getDecimals();
    return formatUnits(balanceBigNumber, decimals);
  }

  async getBalanceOf(address: string): Promise<string> {
    const balanceBigNumber = await this.erc20DataSource.call("balanceOf", [
      address,
    ]);
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
    amount?: string,
  ): Promise<boolean> {
    const token = this.erc20DataSource.contract.connect(signer);
    const transaction = await token.approve(
      spender,
      amount
        ? parseUnits(amount, await this.getDecimals())
        : ethers.constants.MaxUint256,
    );
    await transaction.wait(); // will throw an error if transaction fails
    return true;
  }
}
