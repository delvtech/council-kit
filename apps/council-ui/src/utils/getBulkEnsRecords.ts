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
  const chain = client?.chain || chains[0];

  let ensClient: ReturnType<typeof createEnsPublicClient>;
  try {
    ensClient = createEnsPublicClient({
      chain: chains[0] as any,
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
        ...chunk.map((address) =>
          getName.batch({
            address,
          }),
        ),
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
