import { Address } from "@delvtech/drift";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useSupportedChainId } from "src/ui/network/hooks/useSupportedChainId";
import { EnsRecords, getBulkEnsRecords } from "src/utils/getBulkEnsRecords";

export function useBulkEnsRecords(
  addresses: Address[],
): UseQueryResult<EnsRecords> {
  const chainId = useSupportedChainId();
  const enabled = !!addresses.length;

  return useQuery({
    queryKey: ["bulkEnsRecords", addresses],
    enabled,
    queryFn: enabled
      ? (): Promise<EnsRecords> => {
          return getBulkEnsRecords(addresses, chainId);
        }
      : undefined,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}
