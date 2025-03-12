import { HexString } from "@delvtech/drift";

declare module "clide-js" {
  export interface OptionCustomTypeMap {
    hex: HexString;
    hexArray: HexString[];
  }
}
