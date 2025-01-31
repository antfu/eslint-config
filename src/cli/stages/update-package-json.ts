import * as p from "@clack/prompts";
import fsp from "node:fs/promises";
import path from "node:path";
import c from "picocolors";
import { dependenciesMap, pkgJson } from "../constants";
import type { ExtraLibrariesOption, PromptResult } from "../types";

export async function updatePackageJson(result: PromptResult) {
  const cwd = process.cwd();

  const pathPackageJSON = path.join(cwd, "package.json");

  p.log.step(c.cyan(`Bumping @nirtamir2/eslint-config to v${pkgJson.version}`));

  const pkgContent = await fsp.readFile(pathPackageJSON, "utf8");
  const pkg: Record<string, any> = JSON.parse(pkgContent);

  pkg.devDependencies ??= {};
  pkg.devDependencies["@nirtamir2/eslint-config"] = `^${pkgJson.version}`;
  pkg.devDependencies.eslint ??= pkgJson.devDependencies.eslint
    .replace("npm:eslint-ts-patch@", "")
    .replace(/-\d+$/, "");

  const addedPackages: Array<string> = [];

  if (result.extra.length > 0) {
    result.extra.forEach((item: ExtraLibrariesOption) => {
      switch (item) {
        case "formatter": {
          for (const f of [
            "eslint-plugin-format",
            result.frameworks.includes("astro")
              ? "prettier-plugin-astro"
              : null,
          ] as const) {
            if (!f) continue;
            pkg.devDependencies[f] = pkgJson.devDependencies[f];
            addedPackages.push(f);
          }
          break;
        }
        case "unocss": {
          for (const f of ["@unocss/eslint-plugin"] as const) {
            pkg.devDependencies[f] = pkgJson.devDependencies[f];
            addedPackages.push(f);
          }
          break;
        }
      }
    });
  }

  for (const framework of result.frameworks) {
    const deps = dependenciesMap[framework];
    if (deps) {
      for (const f of deps) {
        pkg.devDependencies[f] = pkgJson.devDependencies[f];
        addedPackages.push(f);
      }
    }
  }

  if (addedPackages.length > 0)
    p.note(`${c.dim(addedPackages.join(", "))}`, "Added packages");

  await fsp.writeFile(pathPackageJSON, JSON.stringify(pkg, null, 2));
  p.log.success(c.green(`Changes wrote to package.json`));
}
