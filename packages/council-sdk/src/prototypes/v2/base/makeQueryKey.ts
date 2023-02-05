export function makeQueryKey(
  address: string,
  methodName: string,
  methodParams?: Record<string, unknown>,
): (string | Record<string, unknown>)[] {
  const queryKey: (string | Record<string, unknown>)[] = [
    "sdk",
    address,
    methodName,
  ];
  if (methodParams) {
    queryKey.push(methodParams);
  }

  return queryKey;
}
