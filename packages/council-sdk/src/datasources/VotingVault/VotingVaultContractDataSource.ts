import {
  GSCVault,
  IVotingVault,
  IVotingVault__factory,
} from "@council/typechain";
import { ethers } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { CouncilContext } from "src/context";
import { ContractDataSource } from "src/datasources/ContractDataSource";
import { VotingVaultDataSource } from "./VotingVaultDataSource";

export class VotingVaultContractDataSource<
    TVault extends IVotingVault | GSCVault = IVotingVault,
  >
  extends ContractDataSource<TVault>
  implements VotingVaultDataSource
{
  constructor(vault: TVault | string, context: CouncilContext) {
    super(
      typeof vault === "string"
        ? (IVotingVault__factory.connect(vault, context.provider) as TVault)
        : vault,
      context,
    );
  }

  async getVotingPower(
    this: ContractDataSource<IVotingVault>,
    address: string,
    atBlock: number,
  ): Promise<string> {
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
