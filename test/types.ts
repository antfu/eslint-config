import type { Linter } from "eslint";
import type { TypedFlatConfigItem } from "../src";

// Make sure they are compatible
((): Linter.Config => {
  return {} as TypedFlatConfigItem;
})();
((): TypedFlatConfigItem => {
  return {} as Linter.Config;
})();
