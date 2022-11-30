import { ENS } from "@ensdomains/ensjs";
import { providers } from "ethers";
import { chunkArray } from "src/utils/ArrayChunk";

/**
 * Fetches ENS names in bulk using MultiCall.
 * Some addresses may not get resolved if the gas limit of the chunk was reached.
 * This size can be tweaked the options.
 * @param {Array<string>} addresses - An array of addresses.
 * @param {providers.Provider} addresses - Ethers provider.
 * @returns {Record<string, string | null>} A record of addresses to ens name. The name is nullable.
 */
export async function getBulkEnsRecords(
  addresses: string[],
  provider: providers.Provider,
  options?: { chunkSize?: number },
): Promise<Record<string, string | null>> {
  const ENSInstance = new ENS();
  await ENSInstance.setProvider(provider as providers.JsonRpcProvider); // safe to cast

  // spit array in chunks to paginate bulk requests
  const chunkedAddresses = chunkArray(addresses, options?.chunkSize ?? 100);

  // fetch each paginated request
  const chunkedResults = await Promise.all(
    chunkedAddresses.map<Promise<[string, string | null][]>>(async (chunk) => {
      // batch call of ens names using MultiCall
      const batch = await ENSInstance.batch(
        ...chunk.map((address) => {
          return ENSInstance.getName.batch(address);
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
