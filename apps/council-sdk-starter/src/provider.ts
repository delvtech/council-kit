import { getDefaultProvider } from "ethers";

const defaultChainId = 1; // mainnet chain id

// get provider using the PROVIDER_URI environment variable. Fallback to a
// default Goerli provider if no environment variable is found.
export const provider = getDefaultProvider(
  process.env.PROVIDER_URI || defaultChainId,
);
