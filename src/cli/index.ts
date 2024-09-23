import * as p from "@clack/prompts";
import process from "node:process";
import c from "picocolors";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { pkgJson } from "./constants";
import { run } from "./run";

function header() {
  console.log("\n");
  p.intro(
    `${c.green(`@nirtamir2/eslint-config `)}${c.dim(`v${pkgJson.version}`)}`,
  );
}

const instance = yargs(hideBin(process.argv))
  .scriptName("@nirtamir2/eslint-config")
  .usage("")
  .command(
    "*",
    "Run the initialization or migration",
    (args) =>
      args
        .option("yes", {
          alias: "y",
          description: "Skip prompts and use default values",
          type: "boolean",
        })
        .option("template", {
          alias: "t",
          description:
            "Use the framework template for optimal customization: vue / react / svelte / astro",
          type: "string",
        })
        .option("extra", {
          alias: "e",
          array: true,
          description:
            "Use the extra utils: formatter / perfectionist / unocss",
          type: "string",
        })
        .help(),
    async (args) => {
      header();
      try {
        await run(args);
      } catch (error) {
        p.log.error(c.inverse(c.red(" Failed to migrate ")));
        p.log.error(c.red(`✘ ${String(error)}`));
        process.exit(1);
      }
    },
  )
  .showHelpOnFail(false)
  .alias("h", "help")
  .version("version", pkgJson.version)
  .alias("v", "version");

// eslint-disable-next-line sonarjs/no-unused-expressions
instance.help().argv;
