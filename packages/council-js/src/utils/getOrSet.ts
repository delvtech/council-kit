export function getOrSet<TValue = any>({
  cache,
  callback,
  key,
}: {
  key: string;
  cache: Map<string, TValue>;
  callback: () => TValue;
}): TValue {
  if (cache.has(key)) {
    return cache.get(key)!;
  }
  const value = callback();
  cache.set(key, value);
  return value;
}
