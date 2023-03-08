import { Event } from "ethers";
import { mockBlock } from "./mockBlock";
import { mockTransaction } from "./mockTransaction";
import { mockTransactionReceipt } from "./mockTransactionReceipt";

export const mockEvent: Event = {
  args: [],
  removeListener: (): null => null,
  getBlock: (): Promise<typeof mockBlock> => Promise.resolve(mockBlock),
  getTransaction: (): Promise<typeof mockTransaction> =>
    Promise.resolve(mockTransaction),
  getTransactionReceipt: (): Promise<typeof mockTransactionReceipt> =>
    Promise.resolve(mockTransactionReceipt),
  blockNumber: 0,
  blockHash: "",
  transactionIndex: 0,
  removed: false,
  address: "",
  data: "",
  topics: [],
  transactionHash: "",
  logIndex: 0,
};
