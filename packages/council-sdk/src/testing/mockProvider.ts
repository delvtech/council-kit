import { MockProvider } from "@wagmi/connectors/mock";
import { Wallet } from "ethers";

const privateKey = process.env.MOCK_WALLET_PRIVATE_KEY;
if (!privateKey) {
  throw "Missing environment variable: MOCK_WALLET_PRIVATE_KEY";
}

export const mockProvider = new MockProvider({
  chainId: 1,
  signer: new Wallet(privateKey),
});
