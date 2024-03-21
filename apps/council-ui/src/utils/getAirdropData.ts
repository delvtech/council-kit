import { councilConfigs, SupportedChainId } from "src/config/council.config";

export interface AirdropData {
  amount: bigint;
  proof: `0x${string}`[];
}

/**
 * Fetch the data needed to claim an airdrop for the given address.
 */
export async function getAirdropData(
  address: string,
  chainId: SupportedChainId,
): Promise<AirdropData | undefined> {
  let baseDataURL = councilConfigs[chainId]?.airdrop?.baseDataURL;

  // Ensure the base URL has a trailing slash
  if (baseDataURL && !baseDataURL.endsWith("/")) {
    baseDataURL += "/";
  }

  let dataURL: URL | undefined;

  // Construct the full URL to fetch the airdrop data from
  // for example:
  //   baseDataURL = "https://cdn.io/airdrop/"
  //   address = "0x123..."
  //   dataURL = "https://cdn.io/airdrop/0x123..."
  //
  //   baseDataURL = "/api/airdrop"
  //   address = "0x123..."
  //   dataURL = "<window.location.origin>/api/airdrop/0x123..."
  if (address && baseDataURL) {
    dataURL = new URL(`${baseDataURL}${address}`, window.location.origin);
  }

  const data = await fetch(dataURL as URL)
    .then(async (res) => {
      // Assume that a 404 means the address doesn't have an airdrop
      if (res.status === 404) {
        return undefined;
      }

      // If the request failed for any other reason, log the error with
      // the response and assume the address doesn't have an airdrop
      if (!res.ok) {
        console.warn(
          `Failed to fetch airdrop data for address ${address}:\n${await res.text()}`,
        );
        return undefined;
      }

      return res.json();
    })
    .catch((err) => {
      console.warn(
        `Failed to fetch airdrop data for address ${address}:\n${err}`,
      );
      return undefined;
    });

  if (!data) {
    return undefined;
  }

  // Throw an error if the data doesn't match the expected format
  if (!isAirdropData(data)) {
    throw new Error(
      `Invalid airdrop data for address ${address}:\n${JSON.stringify(
        data,
        null,
        2,
      )}`,
    );
  }

  return {
    amount: BigInt(data.amount),
    proof: data.proof,
  };
}

/**
 * Validate airdrop data
 */
export function isAirdropData(data: AirdropData | any): data is AirdropData {
  return (
    // It has an amount property that is a string
    data?.amount &&
    typeof data?.amount === "string" &&
    // It has a proof property that is an array of strings
    data?.proof?.length &&
    data?.proof.every((hash: unknown) => typeof hash === "string")
  );
}
