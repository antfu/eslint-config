// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { FlatCompat } from "@eslint/eslintrc";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(path.join(__filename, ".."));

export const compat = new FlatCompat({
  baseDirectory: __dirname,
});
