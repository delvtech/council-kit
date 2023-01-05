import {
  GSCVault,
  IVotingVault,
  IVotingVault__factory,
} from "@council/typechain";
import { ethers } from "ethers";
import { BytesLike, formatEther } from "ethers/lib/utils";
import { CouncilContext } from "src/context";
import { ContractDataSource } from "src/datasources/ContractDataSource";
import { VotingVaultDataSource } from "./VotingVaultDataSource";

/**
 * A DataSource with methods for making cached calls to any voting vault
 * contract that implements {@linkcode IVotingVault} or {@linkcode GSCVault}
 * from the Council protocol.
 */
export class VotingVaultContractDataSource<
    TVault extends IVotingVault | GSCVault = IVotingVault,
  >
  extends ContractDataSource<TVault>
  implements VotingVaultDataSource
{
  /**
   * Create a new `VotingVaultContractDataSource` instance.
   * @param vault An `IVotingVault` or `GSCVault` instance from the
   *   `@council/typechain` package or the address of the vault contract.
   */
  constructor(vault: TVault | string, context: CouncilContext) {
    super(
      typeof vault === "string"
        ? (IVotingVault__factory.connect(vault, context.provider) as TVault)
        : vault,
      context,
    );
  }

  /**
   * Get the voting power owned by a given address in this vault. Returns "0" if
   * the voting power is unable to be fetched.
   * @param extraData ABI encoded optional extra data used by some vaults, such
   *   as merkle proofs.
   */
  async getVotingPower(
    this: ContractDataSource<IVotingVault>,
    address: string,
    atBlock: number,
    extraData: BytesLike = "0x00",
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
        extraData,
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
