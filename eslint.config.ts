// @ts-expect-error missing types
import { antfu } from "./src";

export default antfu(
  {
    vue: true,
    react: true,
    solid: true,
    svelte: true,
    astro: true,
    typescript: true,
    formatters: true,
  },
  {
    ignores: [
      "fixtures",
      "_fixtures",
    ],
  },
);
