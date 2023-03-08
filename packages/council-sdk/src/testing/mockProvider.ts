import { MockProvider } from "@wagmi/connectors/mock";
import { mockSigner } from "src/testing/mockSigner";

export const mockProvider = new MockProvider({
  chainId: 1,
  signer: mockSigner,
});

mockProvider.getBlockNumber = () => Promise.resolve(0);
