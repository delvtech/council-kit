import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { EnsRecords, getBulkEnsRecords } from "src/ens/getBulkEnsRecords";
import { usePublicClient } from "wagmi";

export function useBulkEnsRecords(
  addresses: `0x${string}`[],
): UseQueryResult<EnsRecords> {
  const client = usePublicClient();

  const enabled = !!addresses.length && !!client;

  return useQuery({
    queryKey: ["bulkEnsRecords", addresses],
    enabled,
    queryFn: enabled
      ? (): Promise<EnsRecords> => {
          return getBulkEnsRecords(addresses, client);
        }
      : undefined,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}
