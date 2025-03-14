import { HexString } from "@delvtech/drift";
import { Setting } from "../config.js";

declare module "clide-js" {
  export interface OptionCustomTypeMap {
    hex: HexString;
    hexArray: HexString[];
    setting: Setting;
    settingsArray: Setting[];
  }
}
