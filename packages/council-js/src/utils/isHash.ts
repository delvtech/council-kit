import { HexString } from "@delvtech/drift";

export function isHexString(value?: string): value is HexString {
  return !!value?.startsWith("0x");
}
