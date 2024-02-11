export function commify(value: string | number | bigint): string {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
