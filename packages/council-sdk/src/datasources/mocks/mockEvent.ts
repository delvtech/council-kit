import { mockTransaction } from "src/datasources/mocks/mockTransaction";
import { mockTransactionReceipt } from "src/datasources/mocks/mockTransactionReceipt";
import { mockBlock } from "./mockBlock";

export const mockEvent = {
  args: {},
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
