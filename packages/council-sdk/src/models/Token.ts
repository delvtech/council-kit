import { BigNumber, Signer } from "ethers";
import { CouncilContext } from "src/context";
import { Model } from "./Model";

export class Token extends Model {
  address: string;

  constructor(address: string, context: CouncilContext) {
    super(context);
    this.address = address;
  }

  async getSymbol(): Promise<string> {
    return "CNCL";
  }

  async getDecimals(): Promise<number> {
    return 18;
  }

  async getName(): Promise<string> {
    return "Council Token";
  }

  async getAllowance(owner: string, spender: string): Promise<string> {
    return BigNumber.from(
      "115792089237316195423570985008687907853269984665640564039457584007913129639935",
    ).toString();
  }

  async getBalanceOf(address: string): Promise<string> {
    return "10000";
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
    return true;
  }
}
