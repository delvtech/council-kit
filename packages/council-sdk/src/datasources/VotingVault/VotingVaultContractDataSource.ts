import {
  GSCVault,
  IVotingVault,
  IVotingVault__factory,
} from "@elementfi/council-typechain";
import { providers } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { ContractDataSource } from "src/datasources/ContractDataSource";
import { VotingVaultDataSource } from "./VotingVaultDataSource";

export class VotingVaultContractDataSource
  extends ContractDataSource<IVotingVault | GSCVault>
  implements VotingVaultDataSource
{
  constructor(address: string, provider: providers.Provider) {
    super(IVotingVault__factory.connect(address, provider));
  }

  async getVotingPower(address: string, atBlock: number): Promise<string> {
    const votingPowerBigNumber = await this.callStatic("queryVotePower", [
      address,
      atBlock,
      "0x00",
    ]);
    return formatEther(votingPowerBigNumber);
  }
}
