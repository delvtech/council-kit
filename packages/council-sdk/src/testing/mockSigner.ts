import { Wallet } from "ethers";

const privateKey = process.env.MOCK_WALLET_PRIVATE_KEY;
if (!privateKey) {
  throw "Missing environment variable: MOCK_WALLET_PRIVATE_KEY";
}

export const mockSigner = new Wallet(privateKey);
