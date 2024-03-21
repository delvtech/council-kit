import { ReadVoter } from "@delvtech/council-viem";
import { QueryStatus, useQuery } from "@tanstack/react-query";
import { useReadGscVault } from "./useReadGscVault";

export function useGscMembers(): {
  gscMembers: ReadVoter[] | undefined;
  status: QueryStatus;
} {
  const gscVault = useReadGscVault();
  const enabled = !!gscVault?.address;

  const { data, status } = useQuery({
    queryKey: ["gsc-gsc-members", gscVault?.address],
    enabled,
    queryFn: enabled ? async () => gscVault?.getMembers() : undefined,
  });

  return {
    gscMembers: data,
    status,
  };
}
