import { createClient } from "wagmi";
import { connectors } from "src/wallet/connectors";
import { provider } from "src/provider";

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});
