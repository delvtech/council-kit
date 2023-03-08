import { BigNumber, ethers } from "ethers";

export const mockTransactionReceipt = {
  to: ethers.constants.AddressZero,
  from: ethers.constants.AddressZero,
  transactionIndex: 0,
  contractAddress: ethers.constants.AddressZero,
  gasUsed: BigNumber.from(0),
  logsBloom: "",
  blockHash: "",
  transactionHash: "",
  logs: [],
  blockNumber: 0,
  confirmations: 1,
  cumulativeGasUsed: BigNumber.from(0),
  effectiveGasPrice: BigNumber.from(0),
  byzantium: false,
  type: 0,
};
