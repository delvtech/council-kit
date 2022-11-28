import { Signer } from "ethers";
import { CouncilContext } from "src/context";
import { TransactionOptions } from "src/datasources/ContractDataSource";
import {
  Grant,
  VestingVaultContractDataSource,
} from "src/datasources/VotingVault/VestingVaultContractDataSource";
import { Token } from "src/models/Token";
import { Voter } from "src/models/Voter";
import { sumStrings } from "src/utils/sumStrings";
import { VotingVault, VotingVaultOptions } from "./VotingVault";

interface VestingVaultOptions extends VotingVaultOptions {
  dataSource?: VestingVaultContractDataSource;
}

export class VestingVault extends VotingVault<VestingVaultContractDataSource> {
  constructor(
    address: string,
    context: CouncilContext,
    options?: VestingVaultOptions,
  ) {
    super(address, context, {
      ...options,
      name: options?.name ?? "Vesting Vault",
      dataSource:
        options?.dataSource ??
        context.registerDataSource(
          { address },
          new VestingVaultContractDataSource(address, context.provider),
        ),
    });
  }

  async getToken(): Promise<Token> {
    const address = await this.dataSource.getToken();
    return new Token(address, this.context);
  }

  getGrant(address: string): Promise<Grant> {
    return this.dataSource.getGrant(address);
  }

  async getVoters(fromBlock?: number, toBlock?: number): Promise<Voter[]> {
    const votersWithPower = await this.dataSource.getAllVotersWithPower(
      fromBlock,
      toBlock,
    );
    return votersWithPower.map(
      ({ address }) => new Voter(address, this.context),
    );
  }

  async getTotalVotingPower(
    fromBlock?: number,
    toBlock?: number,
  ): Promise<string> {
    const allVotersWithPower = await this.dataSource.getAllVotersWithPower(
      fromBlock,
      toBlock,
    );
    return sumStrings(allVotersWithPower.map(({ power }) => power));
  }

  getStaleBlockLag(): Promise<number> {
    return this.dataSource.getStaleBlockLag();
  }

  async getHistoricalVotingPower(
    address: string,
    atBlock?: number,
  ): Promise<string> {
    return this.dataSource.getHistoricalVotingPower(
      address,
      atBlock ?? (await this.context.provider.getBlockNumber()),
    );
  }

  async getDelegate(address: string): Promise<Voter> {
    const delegateAddress = await this.dataSource.getDelegate(address);
    return new Voter(delegateAddress, this.context);
  }

  async getDelegatorsTo(address: string, atBlock?: number): Promise<Voter[]> {
    const delegators = await this.dataSource.getDelegatorsTo(address, atBlock);
    return delegators.map(({ address }) => new Voter(address, this.context));
  }

  changeDelegate(
    signer: Signer,
    delegate: string,
    options?: TransactionOptions,
  ): Promise<string> {
    return this.dataSource.changeDelegate(signer, delegate, options);
  }
}
