import { Vote } from "@council/sdk";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { EnsRecords, getBulkEnsRecords } from "src/ens/getBulkEnsRecords";
import { GSCStatus } from "src/vaults/gscVault";
import { useProvider } from "wagmi";

interface VoterStatistics {
  votingHistory: Vote[];
  votingPower: string;
  gscStatus: GSCStatus | null;
}

export function useBulkEnsRecords(
  addresses: string[],
): UseQueryResult<EnsRecords> {
  const provider = useProvider();

  return useQuery({
    queryKey: ["bulkEnsRecords", addresses],
    enabled: !!addresses.length,
    queryFn: (): Promise<EnsRecords> => {
      return getBulkEnsRecords(addresses, provider);
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}
