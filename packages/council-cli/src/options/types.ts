import { HexString } from "@delvtech/drift";
import { CouncilCliSetting } from "../config.js";

declare module "clide-js" {
  export interface OptionCustomTypeMap {
    hex: HexString;
    hexArray: HexString[];
    setting: CouncilCliSetting;
    settingsArray: CouncilCliSetting[];
  }
}
