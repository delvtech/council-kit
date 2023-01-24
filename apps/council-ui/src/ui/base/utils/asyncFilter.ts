export async function asyncFilter<T>(
  data: T[],
  getPredicate: (arg0: T) => Promise<boolean>,
): Promise<T[]> {
  const results = await Promise.all(data.map((v) => getPredicate(v)));
  return data.filter((_, index) => results[index]);
}
