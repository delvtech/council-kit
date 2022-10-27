import { provider } from "src/provider";
import { connectors } from "src/wallet/connectors";
import { createClient } from "wagmi";

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});
