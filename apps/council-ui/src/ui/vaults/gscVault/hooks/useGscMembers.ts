import { Address } from "@delvtech/drift";
import { QueryStatus, useQuery } from "@tanstack/react-query";
import { useReadGscVault } from "./useReadGscVault";

export function useGscMembers(): {
  gscMembers: Address[] | undefined;
  status: QueryStatus;
} {
  const gscVault = useReadGscVault();
  const enabled = !!gscVault?.address;

  const { data, status } = useQuery({
    queryKey: ["gsc-gsc-members", gscVault?.address],
    enabled,
    queryFn: () => {
      return enabled ? gscVault.getMembers() : [];
    },
  });

  return {
    gscMembers: data,
    status,
  };
}
