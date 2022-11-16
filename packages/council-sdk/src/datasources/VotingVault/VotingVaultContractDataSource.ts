import {
  GSCVault,
  IVotingVault,
  IVotingVault__factory,
} from "@elementfi/council-typechain";
import { ethers, providers } from "ethers";
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
    try {
      // TODO: find a better solution for this.
      // ethers.js will spit out an error message that we can't disable without turning off the
      // logger.  because the smart contract code for queryVotePower returns an error if the
      // account is not found, it can flood the console with errors.  this is a workaround until a
      // better solution is found.
      ethers.utils.Logger.setLogLevel(ethers.utils.Logger.levels.OFF);
      const votingPowerBigNumber = await this.callStatic("queryVotePower", [
        address,
        atBlock,
        "0x00",
      ]);
      ethers.utils.Logger.setLogLevel(ethers.utils.Logger.levels.WARNING);
      return formatEther(votingPowerBigNumber);
    } catch (error) {
      // TODO: how should dataSource errors be handled?
      if (process.env.NODE_ENV === "development") {
        console.error(error);
      }
      return "0";
    }
  }
}
