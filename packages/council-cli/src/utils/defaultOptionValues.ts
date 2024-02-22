import { OptionValues, OptionsConfig } from "clide-js";

export default function defaultOptionValues(
  optionsConfig: OptionsConfig,
): OptionValues {
  return Object.fromEntries(
    Object.entries(optionsConfig).map(([key, config]) => {
      return [key, config.default];
    }),
  ) as OptionValues;
}
