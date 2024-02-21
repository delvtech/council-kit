import {
  UnsupportedNetworkError,
  createEnsPublicClient,
} from "@ensdomains/ensjs";
import { getName } from "@ensdomains/ensjs/public";
import chunk from "lodash.chunk";
import { chains, transports } from "src/lib/wagmi";
import { PublicClient } from "viem";
import { UsePublicClientReturnType } from "wagmi";

export type EnsRecords = Record<string, string | null>;

/**
 * Fetches ENS names in bulk using MultiCall.
 * Some addresses may not get resolved if the gas limit of the chunk was reached.
 * This size can be tweaked the options.
 * @param {Array<string>} addresses - An array of addresses.
 * @param {providers.Provider} addresses - Ethers provider.
 * @returns {Record<string, string | null>} A record of addresses to ens name. The name is nullable.
 */
export async function getBulkEnsRecords(
  addresses: `0x${string}`[],
  client: PublicClient | UsePublicClientReturnType,
  options?: { chunkSize?: number },
): Promise<EnsRecords> {
  let chain: any = client?.chain || chains[0];

  // ensjs is currently incompatible with viem v2. There's a PR to fix this
  // here: https://github.com/ensdomains/ensjs-v3/pull/175.
  // Until then, we have to manually patch the chain definition for mainnet to
  // look like the one ensjs expects.
  if (chain.id === 1) {
    chain = {
      ...chain,
      network: "homestead",
      contracts: {
        ...chain.contracts,
        ensUniversalResolver: {
          address: "0xc0497E381f536Be9ce14B0dD3817cBcAe57d2F62",
          blockCreated: 16966585,
        },
      },
    };
  }

  let ensClient: ReturnType<typeof createEnsPublicClient>;
  try {
    ensClient = createEnsPublicClient({
      chain: chain,
      transport: transports[chain.id],
    }) as ReturnType<typeof createEnsPublicClient>;
  } catch (error) {
    // Not every network is supported by ENS, so we return null for all addresses
    if (error instanceof UnsupportedNetworkError) {
      return Object.fromEntries(addresses.map((address) => [address, null]));
    }
  }

  // spit array in chunks to paginate bulk requests
  const chunkedAddresses = chunk(addresses, options?.chunkSize ?? 100);

  // fetch each paginated request
  const chunkedResults = await Promise.all(
    chunkedAddresses.map(async (chunk): Promise<[string, string | null][]> => {
      // batch call of ens names using MultiCall
      const batch = await ensClient.ensBatch(
        ...chunk.map((address) => {
          return getName.batch({
            address,
          });
        }),
      );

      // batch may not exist if gas limited was reached when reading
      // TODO @cashd: investigate why certain addresses require more gas to read than others, by 10x deviation.
      if (batch) {
        return chunk.map((address, i) => {
          return [address, batch[i]?.name ?? null];
        });
      }

      return chunk.map((address) => [address, null]);
    }),
  );

  // construct the record
  const records = Object.fromEntries(chunkedResults.flat());
  return records;
}
