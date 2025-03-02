import { Address } from "@delvtech/drift";
import {
  createEnsPublicClient,
  EnsPublicClient,
  UnsupportedChainError,
} from "@ensdomains/ensjs";
import { getName } from "@ensdomains/ensjs/public";
import chunk from "lodash.chunk";
import { SupportedChainId } from "src/config/council.config";
import { chains, transports } from "src/lib/wagmi";

export type EnsRecords = Record<Address, string | undefined>;

/**
 * Fetches ENS names in bulk using MultiCall.
 * Some addresses may not get resolved if the gas limit of the chunk was reached.
 * This size can be tweaked the options.
 */
export async function getBulkEnsRecords(
  addresses: `0x${string}`[],
  chainId: SupportedChainId,
  options?: { chunkSize?: number },
): Promise<EnsRecords> {
  const chain = chains[chainId];
  const transport = transports[chain.id];

  // TODO @ryangoree: Remove this once tested
  // ensjs is currently incompatible with viem v2. There's a PR to fix this
  // here: https://github.com/ensdomains/ensjs-v3/pull/175.
  // Until then, we have to manually patch the chain definition for mainnet to
  // look like the one ensjs expects.
  // if (chain.id === 1) {
  //   chain = {
  //     ...chain,
  //     network: "homestead",
  //     contracts: {
  //       ...chain.contracts,
  //       ensUniversalResolver: {
  //         address: "0xc0497E381f536Be9ce14B0dD3817cBcAe57d2F62",
  //         blockCreated: 16966585,
  //       },
  //     },
  //   };
  // }

  let ensClient: EnsPublicClient;
  try {
    ensClient = createEnsPublicClient({
      chain: chain as any,
      transport,
    }) as EnsPublicClient;
  } catch (error) {
    // Not every chain is supported by ENS, so we return undefined for all addresses
    if (error instanceof UnsupportedChainError) {
      return Object.fromEntries(
        addresses.map((address) => [address, undefined]),
      );
    }
  }

  // spit array in chunks to paginate bulk requests
  const chunkedAddresses = chunk(addresses, options?.chunkSize ?? 100);

  // fetch each paginated request
  const chunkedResults = await Promise.all(
    chunkedAddresses.map(
      async (chunk): Promise<[string, string | undefined][]> => {
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
            return [address, batch[i]?.name ?? undefined];
          });
        }

        return chunk.map((address) => [address, undefined]);
      },
    ),
  );

  // construct the record
  const records = Object.fromEntries(chunkedResults.flat());
  return records;
}
