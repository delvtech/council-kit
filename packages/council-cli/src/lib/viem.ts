import { Client, Hex } from "viem";
import {
  anvil,
  arbitrum,
  base,
  gnosis,
  goerli,
  hardhat,
  linea,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from "viem/chains";

export const configuredChains = {
  [formatChainName(anvil.name)]: anvil,
  [formatChainName(arbitrum.name)]: arbitrum,
  [formatChainName(base.name)]: base,
  [formatChainName(gnosis.name)]: gnosis,
  [formatChainName(goerli.name)]: goerli,
  [formatChainName(hardhat.name)]: hardhat,
  [formatChainName(linea.name)]: linea,
  [formatChainName(mainnet.name)]: mainnet,
  [formatChainName(optimism.name)]: optimism,
  [formatChainName(polygon.name)]: polygon,
  [formatChainName(sepolia.name)]: sepolia,
};

type ConfiguredChains = typeof configuredChains;
export type ConfiguredChain = keyof ConfiguredChains;

export function formatChainName<K extends string>(name: K): HyphenCase<K> {
  return name.replace(" ", "-").toLowerCase() as HyphenCase<K>;
}

export type HyphenCase<T extends string> = T extends `${infer A}${infer B}`
  ? B extends ` ${infer C}`
    ? `${Lowercase<A>}-${HyphenCase<Lowercase<C>>}`
    : `${Lowercase<A>}${HyphenCase<B>}`
  : T;

export const localChainIds: number[] = [hardhat.id, anvil.id];

/**
 * Mine a given number of blocks on the local testnet
 * @param blocks The number of blocks to mine
 * @returns The new current block number
 */
export async function mine({
  blocks,
  client,
}: {
  blocks: number;
  client: Client;
}): Promise<void> {
  const methodsToTry: any[] = ["hardhat_mine", "anvil_mine"];
  const params: [Hex] = [`0x${blocks.toString(16)}`];
  let success = true;
  let error: unknown;

  while (!success && methodsToTry.length) {
    await client
      .request({
        method: methodsToTry.shift()!,
        params,
      })
      .then(() => {
        success = true;
      })
      .catch((e) => {
        error ||= e;
      });
  }

  if (!success) {
    throw error;
  }
}
