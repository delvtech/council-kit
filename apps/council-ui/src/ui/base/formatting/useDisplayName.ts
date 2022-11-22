import { useEffect, useState } from "react";
import { useProvider } from "wagmi";
import { formatAddress } from "./formatAddress";

export function useDisplayName(address: string): string {
  const [name, setName] = useState(formatAddress(address));
  const provider = useProvider();

  useEffect(() => {
    provider.lookupAddress(address).then((ens) => {
      if (ens) {
        setName(ens);
      }
    });
  }, [address, provider]);

  return name;
}
