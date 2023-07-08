import { useQuery } from "@tanstack/react-query";
import { councilConfigs } from "src/config/council.config";
import { useChainId } from "src/ui/network/useChainId";

export interface AirdropData {
  amount: string;
  proof: string[];
}

/**
 * Fetch the data needed to claim an airdrop for the given address.
 * If the address doesn't have an airdrop, `airdropData` will be `undefined`.
 * @param address - The address to fetch the airdrop data for
 * @returns The airdrop data and the status of the request
 */
export function useAirdropData(address: string | undefined): {
  airdropData: AirdropData | undefined;
  airdropDataStatus: "loading" | "error" | "success";
  hasAirdrop: boolean | undefined;
} {
  const chainId = useChainId();
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

  const { data, status } = useQuery<AirdropData | undefined>({
    queryKey: [dataURL],
    enabled: !!dataURL,
    select: (data) => data ?? undefined,
    queryFn: dataURL
      ? async (): Promise<any> => {
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
            return null;
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

          return data;
        }
      : undefined,
  });

  return {
    airdropData: data,
    airdropDataStatus: status,
    // If the request hasn't succeeded, we don't know if the address has an
    // airdrop or not. Otherwise If data has an amount property that is a number
    // greater than 0, then the address does have an airdrop.
    hasAirdrop:
      status === "success" ? !!data && /[1-9]/.test(data.amount) : undefined,
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
