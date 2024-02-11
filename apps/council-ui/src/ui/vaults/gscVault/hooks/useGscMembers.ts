import { ReadVoter } from "@delvtech/council-viem";
import { QueryStatus, useQuery } from "@tanstack/react-query";
import { useReadGscVault } from "./useReadGscVault";

export function useGscMembers(): {
  gscMembers: ReadVoter[] | undefined;
  status: QueryStatus;
} {
  const gscVault = useReadGscVault();

  const { data, status } = useQuery({
    queryKey: ["gsc-status", gscVault?.address],
    queryFn: async () => gscVault?.getMembers(),
  });

  return {
    gscMembers: data,
    status,
  };
}
