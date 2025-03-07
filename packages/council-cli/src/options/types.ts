import { HexString } from "@delvtech/drift";

declare module "clide-js" {
  export interface OptionPrimitiveTypeMap {
    hex: HexString;
    hexArray: HexString[];
  }
}
