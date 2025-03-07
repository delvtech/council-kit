import { createCouncil, ReadWriteCouncil } from "@delvtech/council-js";
import { createDrift, Drift, ReadWriteAdapter } from "@delvtech/drift";
import { viemAdapter } from "@delvtech/drift-viem";
import { Client, options, OptionsGetter } from "clide-js";
import {
  Account,
  Chain,
  createPublicClient,
  createWalletClient,
  http,
  PrivateKeyAccount,
  PublicClient,
  Transport,
  WalletClient,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { chainOption, getChain } from "./chain.js";
import { rpcUrlOption } from "./rpc-url.js";
import { walletKeyOption } from "./wallet-key.js";

export const writeOptions = options({
  [chainOption.alias[0]]: chainOption,
  [rpcUrlOption.alias[0]]: rpcUrlOption,
  [walletKeyOption.alias[0]]: walletKeyOption,
});

export interface WriteOptions {
  chain: Chain;
  rpcUrl: string;
  account: PrivateKeyAccount;
  publicClient: PublicClient<Transport, Chain>;
  walletClient: WalletClient<Transport, Chain, Account>;
  drift: Drift<ReadWriteAdapter>;
  council: ReadWriteCouncil;
}

export async function getWriteOptions(
  optionsGetter: OptionsGetter<typeof writeOptions>,
  client?: Client,
): Promise<WriteOptions> {
  const chain = await getChain(optionsGetter.chain, client);

  const rpcUrl = await optionsGetter.rpcUrl({
    prompt: "Enter RPC URL",
  });

  const walletKey = await optionsGetter.walletKey({
    prompt: "Enter wallet key",
  });

  const account = privateKeyToAccount(walletKey as `0x${string}`);
  const transport = http(rpcUrl);
  const publicClient = createPublicClient({ chain, transport });
  const walletClient = createWalletClient({ transport, chain, account });
  const drift = createDrift({
    adapter: viemAdapter({ publicClient, walletClient }),
  });
  const council = createCouncil({ drift });

  return {
    chain,
    rpcUrl,
    account,
    publicClient,
    walletClient,
    drift,
    council,
  };
}
