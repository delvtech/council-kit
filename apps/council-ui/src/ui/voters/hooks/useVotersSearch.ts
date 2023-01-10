import Fuse from "fuse.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { VoterRowData } from "src/ui/voters/types";

const voterSearchFuseOptions = {
  threshold: 0.3,
  isCaseSensitive: false,
  ignoreLocation: true,
  keys: ["address", "ensName"],
};

export function useVotersSearch(data: Array<VoterRowData> | undefined): {
  results: VoterRowData[];
  reset: () => void;
  search: (i: string) => void;
} {
  const [input, setInput] = useState<string | null>(null);

  const searchCache = useRef<Record<string, Array<VoterRowData>>>({});
  useEffect(() => {
    searchCache.current = {};
  }, [data]);

  const results = useMemo(() => {
    const fuse = new Fuse(data ?? [], voterSearchFuseOptions);

    if (input) {
      if (searchCache.current[input]) {
        return searchCache.current[input];
      }

      const filtered = fuse.search(input).map((item) => item.item);
      searchCache.current[input] = filtered;

      return filtered;
    }

    return data ?? [];
  }, [input, data]);

  return {
    results,
    reset: () => setInput(""),
    search: (i: string) => setInput(i),
  };
}
