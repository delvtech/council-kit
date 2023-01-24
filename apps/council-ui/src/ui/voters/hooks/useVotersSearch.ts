import Fuse from "fuse.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { VoterRowData } from "src/ui/voters/types";

const voterSearchFuseOptions = {
  threshold: 0.3,
  isCaseSensitive: false,
  ignoreLocation: true,
  keys: ["address", "ensName"],
};

export function useVotersSearch(voters: VoterRowData[] | undefined): {
  results: VoterRowData[];
  reset: () => void;
  search: (i: string) => void;
} {
  const [input, setInput] = useState("");

  const searchCache = useRef<Record<string, VoterRowData[]>>({});
  useEffect(() => {
    searchCache.current = {};
  }, [voters]);

  const results = useMemo(() => {
    if (!input) {
      return voters || [];
    }
    const fuse = new Fuse(voters || [], voterSearchFuseOptions);

    if (searchCache.current[input]) {
      return searchCache.current[input];
    }

    const filtered = fuse.search(input).map((result) => result.item);
    searchCache.current[input] = filtered;

    return filtered;
  }, [input, voters]);

  return {
    results,
    reset: () => setInput(""),
    search: setInput,
  };
}
