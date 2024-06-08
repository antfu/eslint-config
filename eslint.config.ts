// @ts-expect-error missing types
import { nirtamir2 } from "./src";

export default nirtamir2(
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
