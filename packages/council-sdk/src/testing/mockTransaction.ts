import { BigNumber, ContractTransaction, ethers } from "ethers";
import { mockTransactionReceipt } from "./mockTransactionReceipt";

export const mockTransaction: ContractTransaction = {
  wait: (): Promise<typeof mockTransactionReceipt> =>
    Promise.resolve(mockTransactionReceipt),
  hash: "",
  confirmations: 0,
  from: ethers.constants.AddressZero,
  nonce: 0,
  gasLimit: BigNumber.from(0),
  data: "",
  value: BigNumber.from(0),
  chainId: 1,
};
