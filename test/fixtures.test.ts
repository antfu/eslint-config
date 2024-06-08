import { join, resolve } from "node:path";
import { afterAll, beforeAll, it } from "vitest";
import fs from "fs-extra";
import { execa } from "execa";
import fg from "fast-glob";
import type { OptionsConfig, TypedFlatConfigItem } from "../src/types";

beforeAll(async () => {
  await fs.rm("_fixtures", { recursive: true, force: true });
});
afterAll(async () => {
  await fs.rm("_fixtures", { recursive: true, force: true });
});

runWithConfig("js", {
  typescript: false,
  vue: false,
});
runWithConfig("all", {
  typescript: true,
  vue: true,
  svelte: true,
  astro: true,
});
runWithConfig("no-style", {
  typescript: true,
  vue: true,
  stylistic: false,
});
runWithConfig(
  "tab-double-quotes",
  {
    typescript: true,
    vue: true,
    stylistic: {
      indent: "tab",
      quotes: "double",
    },
  },
  {
    rules: {
      "@stylistic/no-mixed-spaces-and-tabs": "off",
    },
  }
);

// https://github.com/nirtamir2/eslint-config/issues/255
runWithConfig(
  "ts-override",
  {
    typescript: true,
  },
  {
    rules: {
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    },
  }
);

runWithConfig("with-formatters", {
  typescript: true,
  vue: true,
  astro: true,
  formatters: true,
});

runWithConfig("no-markdown-with-formatters", {
  jsx: false,
  vue: false,
  markdown: false,
  formatters: {
    markdown: true,
  },
});

function runWithConfig(
  name: string,
  configs: OptionsConfig,
  ...items: Array<TypedFlatConfigItem>
) {
  it.concurrent(
    name,
    async ({ expect }) => {
      const from = resolve("fixtures/input");
      const output = resolve("fixtures/output", name);
      const target = resolve("_fixtures", name);

      await fs.copy(from, target, {
        filter: (src) => {
          return !src.includes("node_modules");
        },
      });
      await fs.writeFile(
        join(target, "eslint.config.js"),
        `
// @eslint-disable
import nirtamir2 from '@nirtamir2/eslint-config'

export default nirtamir2(
  ${JSON.stringify(configs)},
  ...${JSON.stringify(items) ?? []},
)
  `
      );

      await execa("npx", ["eslint", ".", "--fix"], {
        cwd: target,
        stdio: "pipe",
      });

      const files = await fg("**/*", {
        ignore: ["node_modules", "eslint.config.js"],
        cwd: target,
      });

      await Promise.all(
        files.map(async (file) => {
          const content = await fs.readFile(join(target, file), "utf8");
          const source = await fs.readFile(join(from, file), "utf8");
          const outputPath = join(output, file);
          if (content === source) {
            if (fs.existsSync(outputPath)) fs.remove(outputPath);
            return;
          }
          await expect.soft(content).toMatchFileSnapshot(join(output, file));
        })
      );
    },
    30_000
  );
}
