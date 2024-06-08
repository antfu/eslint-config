import createCommand from "eslint-plugin-command/config";
import type { TypedFlatConfigItem } from "../types";

export async function command(): Promise<Array<TypedFlatConfigItem>> {
  return [
    {
      ...createCommand(),
      name: "antfu/command/rules",
    },
  ];
}
