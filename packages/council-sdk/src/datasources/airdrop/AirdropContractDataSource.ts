import { Airdrop, Airdrop__factory } from "@council/typechain";
import { Signer } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { CouncilContext } from "src/context/context";
import {
  ContractDataSource,
  TransactionOptions,
} from "src/datasources/base/contract/ContractDataSource";
import { ERC20ContractDataSource } from "src/datasources/token/ERC20ContractDataSource";
import { TokenDataSource } from "src/datasources/token/TokenDataSource";
import { AirdropDataSource } from "./AirdropDataSource";

type TokenDataSourceGetter = (
  address: string,
  context: CouncilContext,
) => TokenDataSource;

export interface AirdropContractDataSourceOptions {
  /**
   * A function to get a token data source which will be used by methods that
   * require data from the the airdrop token (e.g., decimals).
   */
  tokenDataSourceGetter?: TokenDataSourceGetter;
}

export class AirdropContractDataSource
  extends ContractDataSource<Airdrop>
  implements AirdropDataSource
{
  private tokenDataSourceGetter: TokenDataSourceGetter;

  constructor(
    address: string,
    context: CouncilContext,
    options?: AirdropContractDataSourceOptions,
  ) {
    super(Airdrop__factory.connect(address, context.provider), context);

    this.tokenDataSourceGetter =
      options?.tokenDataSourceGetter || defaultTokenDataSourceGetter;
  }

  private async getTokenDecimals(): Promise<number> {
    const tokenAddress = await this.getToken();
    const tokenDataSource = this.tokenDataSourceGetter(
      tokenAddress,
      this.context,
    );
    return tokenDataSource.getDecimals();
  }

  async getExpiration(): Promise<number> {
    const expiration = await this.call("expiration", []);
    return expiration.toNumber();
  }

  getMerkleRoot(): Promise<string> {
    return this.call("rewardsRoot", []);
  }

  getToken(): Promise<string> {
    return this.call("token", []);
  }

  async getClaimedAmount(address: string): Promise<string> {
    const amount = await this.call("claimed", [address]);
    const decimals = await this.getTokenDecimals();
    return formatUnits(amount, decimals);
  }

  getLockingVault(): Promise<string> {
    return this.call("lockingVault", []);
  }

  async claim(
    signer: Signer,
    amount: string,
    totalGrant: string,
    merkleProof: string[],
    destination?: string,
    options?: TransactionOptions,
  ): Promise<string> {
    const address = await signer.getAddress();
    const decimals = await this.getTokenDecimals();

    const transaction = await this.callWithSigner(
      "claim",
      [
        parseUnits(amount, decimals),
        parseUnits(totalGrant, decimals),
        merkleProof,
        destination || address,
      ],
      signer,
      options,
    );
    this.deleteCall("claimed", [address]);

    return transaction.hash;
  }

  async claimAndDelegate(
    signer: Signer,
    amount: string,
    delegate: string,
    totalGrant: string,
    merklProof: string[],
    destination?: string,
    options?: TransactionOptions,
  ): Promise<string> {
    const address = await signer.getAddress();
    const decimals = await this.getTokenDecimals();

    const transaction = await this.callWithSigner(
      "claimAndDelegate",
      [
        parseUnits(amount, decimals),
        delegate,
        parseUnits(totalGrant, decimals),
        merklProof,
        destination || address,
      ],
      signer,
      options,
    );
    this.deleteCall("claimed", [address]);

    return transaction.hash;
  }

  async reclaim(
    signer: Signer,
    destination?: string,
    options?: TransactionOptions,
  ): Promise<string> {
    const transaction = await this.callWithSigner(
      "reclaim",
      [destination || (await signer.getAddress())],
      signer,
      options,
    );
    this.clearCached();
    return transaction.hash;
  }
}

function defaultTokenDataSourceGetter(
  address: string,
  context: CouncilContext,
) {
  return context.registerDataSource(
    { address },
    new ERC20ContractDataSource(address, context),
  );
}
