import { BigNumber, providers } from "ethers";

export const mockBlock: providers.Block = {
  transactions: [],
  hash: "",
  parentHash: "",
  number: 0,
  timestamp: 0,
  nonce: "",
  difficulty: 0,
  _difficulty: BigNumber.from(0),
  gasLimit: BigNumber.from(0),
  gasUsed: BigNumber.from(0),
  miner: "",
  extraData: "",
};
