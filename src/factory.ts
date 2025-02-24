import type { Linter } from "eslint";
import { FlatConfigComposer } from "eslint-flat-config-utils";
import { isPackageExists } from "local-pkg";
import fs from "node:fs";
import {
  astro,
  command,
  comments,
  disables,
  ignores,
  imports,
  javascript,
  jsdoc,
  jsonc,
  jsx,
  markdown,
  node,
  perfectionist,
  react,
  solid,
  sortPackageJson,
  sortTsconfig,
  stylistic,
  svelte,
  test,
  toml,
  tsdoc,
  typescript,
  unicorn,
  unocss,
  vue,
  yaml,
} from "./configs";
import { formatters } from "./configs/formatters";
import { i18n } from "./configs/i18n";
import { prettier } from "./configs/prettier";
import { query } from "./configs/query";
import { regexp } from "./configs/regexp";
import { security } from "./configs/security";
import { storybook } from "./configs/storybook";
import { tailwindcss } from "./configs/tailwindcss";
import type {
  Awaitable,
  ConfigNames,
  OptionsConfig,
  TypedFlatConfigItem,
} from "./types";
import { interopDefault, isInEditorEnv } from "./utils";

const flatConfigProps: Array<keyof TypedFlatConfigItem> = [
  "name",
  "files",
  "ignores",
  "languageOptions",
  "linterOptions",
  "processor",
  "plugins",
  "rules",
  "settings",
];

const VuePackages = ["vue", "nuxt", "vitepress", "@slidev/cli"];

const TanstackQueryPackages = [
  "@tanstack/react-query",
  "@tanstack/solid-query",
];

const StorybookPackages = [
  "@storybook/addon-a11y",
  "@storybook/addon-essentials",
  "@storybook/addon-interactions",
  "@storybook/addon-links",
  "@storybook/addon-storysource",
  "@storybook/blocks",
  "@storybook/nextjs",
  "@storybook/react",
  "@storybook/test",
];

export const defaultPluginRenaming = {
  "@eslint-react": "react",
  "@eslint-react/dom": "react-dom",
  "@eslint-react/hooks-extra": "react-hooks-extra",
  "@eslint-react/naming-convention": "react-naming-convention",

  "@stylistic": "style",
  "@typescript-eslint": "ts",
  "import-x": "import",
  n: "node",
  vitest: "test",
  yml: "yaml",
};

/**
 * Construct an array of ESLint flat config items.
 * @param {OptionsConfig & TypedFlatConfigItem} options
 *  The options for generating the ESLint configurations.
 * @param {Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]>[]} userConfigs
 *  The user configurations to be merged with the generated configurations.
 * @returns {Promise<TypedFlatConfigItem[]>}
 *  The merged ESLint configurations.
 */
export function nirtamir2(
  options: OptionsConfig & TypedFlatConfigItem = {},
  ...userConfigs: Array<
    Awaitable<
      | TypedFlatConfigItem
      | Array<TypedFlatConfigItem>
      | FlatConfigComposer<any, any>
      | Array<Linter.Config>
    >
  >
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
  const {
    astro: enableAstro = false,
    // autoRenamePlugins = true,
    componentExts = [],
    gitignore: enableGitignore = true,
    isInEditor = isInEditorEnv(),
    jsx: enableJsx = true,
    react: enableReact = false,
    regexp: enableRegexp = true,
    solid: enableSolid = false,
    svelte: enableSvelte = false,
    tailwindcss: enableTailwindCSS = isPackageExists("tailwindcss"),
    typescript: enableTypeScript = isPackageExists("typescript"),
    unocss: enableUnoCSS = false,
    vue: enableVue = VuePackages.some((i) => isPackageExists(i)),
    storybook: enableStorybook = StorybookPackages.some((i) =>
      isPackageExists(i),
    ),
    query: enableQuery = TanstackQueryPackages.some((i) => isPackageExists(i)),
    i18n: enableI18n = false,
    security: enableSecurity = false,
  } = options;

  const stylisticOptions =
    options.stylistic === false || options.stylistic == null
      ? false
      : typeof options.stylistic === "object"
        ? options.stylistic
        : {};

  if (stylisticOptions && !("jsx" in stylisticOptions))
    stylisticOptions.jsx = enableJsx;

  const configs: Array<Awaitable<Array<TypedFlatConfigItem>>> = [];

  if (enableGitignore) {
    if (typeof enableGitignore === "boolean") {
      if (fs.existsSync(".gitignore"))
        configs.push(
          interopDefault(import("eslint-config-flat-gitignore")).then((r) => [
            r(),
          ]),
        );
    } else {
      configs.push(
        interopDefault(import("eslint-config-flat-gitignore")).then((r) => [
          r(enableGitignore),
        ]),
      );
    }
  }

  const typescriptOptions = resolveSubOptions(options, "typescript");
  const tsconfigPath =
    "tsconfigPath" in typescriptOptions
      ? typescriptOptions.tsconfigPath
      : undefined;

  // Base configs
  configs.push(
    ignores(),
    javascript({
      isInEditor,
      overrides: getOverrides(options, "javascript"),
    }),
    comments(),
    node(),
    imports({
      stylistic: stylisticOptions,
    }),
    unicorn(),
    command(),

    // Optional plugins (installed but not enabled by default)
    perfectionist(),
  );

  if (enableVue) {
    componentExts.push("vue");
  }

  if (enableJsx) {
    configs.push(jsx());
  }

  if (enableTypeScript) {
    configs.push(
      typescript({
        ...typescriptOptions,
        componentExts,
        overrides: getOverrides(options, "typescript"),
      }),
    );
  }

  if (stylisticOptions) {
    configs.push(
      stylistic({
        ...stylisticOptions,
        lessOpinionated: options.lessOpinionated,
        overrides: getOverrides(options, "stylistic"),
      }),
    );
  }

  if (enableRegexp) {
    configs.push(regexp(typeof enableRegexp === "boolean" ? {} : enableRegexp));
  }

  if (options.test ?? true) {
    configs.push(
      test({
        isInEditor,
        overrides: getOverrides(options, "test"),
      }),
    );
  }

  if (enableVue) {
    configs.push(
      vue({
        ...resolveSubOptions(options, "vue"),
        overrides: getOverrides(options, "vue"),
        stylistic: stylisticOptions,
        typescript: Boolean(enableTypeScript),
      }),
    );
  }

  if (enableReact) {
    configs.push(
      react({
        overrides: getOverrides(options, "react"),
        tsconfigPath,
      }),
    );
  }

  if (enableSolid) {
    configs.push(
      solid({
        overrides: getOverrides(options, "solid"),
        tsconfigPath,
        typescript: Boolean(enableTypeScript),
      }),
    );
  }

  if (enableSvelte) {
    configs.push(
      svelte({
        overrides: getOverrides(options, "svelte"),
        stylistic: stylisticOptions,
        typescript: Boolean(enableTypeScript),
      }),
    );
  }

  if (enableUnoCSS) {
    configs.push(
      unocss({
        ...resolveSubOptions(options, "unocss"),
        overrides: getOverrides(options, "unocss"),
      }),
    );
  }

  if (enableI18n) {
    configs.push(i18n());
  }

  if (enableSecurity) {
    configs.push(security());
  }

  if (enableTailwindCSS) {
    configs.push(tailwindcss());

    if (enableQuery) {
      configs.push(query());
    }
  }

  if (enableAstro) {
    configs.push(
      astro({
        overrides: getOverrides(options, "astro"),
        stylistic: stylisticOptions,
      }),
    );
  }

  if (enableStorybook) {
    configs.push(storybook());
  }

  if (options.jsonc ?? true) {
    configs.push(
      jsonc({
        overrides: getOverrides(options, "jsonc"),
        stylistic: stylisticOptions,
      }),
      sortPackageJson(),
      sortTsconfig(),
    );
  }

  if (options.jsdoc ?? false) {
    configs.push(
      jsdoc({
        stylistic: stylisticOptions,
        overrides: getOverrides(options, "jsdoc"),
      }),
    );
  }

  if (options.tsdoc ?? false) {
    configs.push(
      tsdoc({
        overrides: getOverrides(options, "tsdoc"),
      }),
    );
  }

  if (options.yaml ?? true) {
    configs.push(
      yaml({
        overrides: getOverrides(options, "yaml"),
        stylistic: stylisticOptions,
      }),
    );
  }

  if (options.toml ?? true) {
    configs.push(
      toml({
        overrides: getOverrides(options, "toml"),
        stylistic: stylisticOptions,
      }),
    );
  }

  if (options.markdown ?? true) {
    configs.push(
      markdown({
        componentExts,
        overrides: getOverrides(options, "markdown"),
      }),
    );
  }

  if (options.formatters) {
    configs.push(
      formatters(
        options.formatters,
        typeof stylisticOptions === "boolean" ? {} : stylisticOptions,
      ),
    );
  }

  configs.push(prettier());

  // eslint-disable-next-line unicorn/no-array-push-push
  configs.push(disables());

  if ("files" in options) {
    throw new Error(
      '[@antfu/eslint-config] The first argument should not contain the "files" property as the options are supposed to be global. Place it in the second or later config instead.',
    );
  }

  // User can optionally pass a flat config item to the first argument
  // We pick the known keys as ESLint would do schema validation
  const fusedConfig = flatConfigProps.reduce((acc, key) => {
    if (key in options) acc[key] = options[key] as any;
    return acc;
  }, {} as TypedFlatConfigItem);
  if (Object.keys(fusedConfig).length > 0) configs.push([fusedConfig]);

  let composer = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>();

  composer = composer.append(...configs, ...(userConfigs as any));

  // if (autoRenamePlugins) {
  //   composer = composer
  //     .renamePlugins(defaultPluginRenaming)
  // }

  if (isInEditor) {
    composer = composer.disableRulesFix(
      [
        "unused-imports/no-unused-imports",
        "test/no-only-tests",
        "prefer-const",
      ],
      {
        builtinRules: () =>
          import(["eslint", "use-at-your-own-risk"].join("/")).then(
            (r) => r.builtinRules,
          ),
      },
    );
  }

  return composer;
}

export type ResolvedOptions<T> = T extends boolean ? never : NonNullable<T>;

export function resolveSubOptions<K extends keyof OptionsConfig>(
  options: OptionsConfig,
  key: K,
): ResolvedOptions<OptionsConfig[K]> {
  return typeof options[key] === "boolean" ? ({} as any) : options[key] || {};
}

export function getOverrides<K extends keyof OptionsConfig>(
  options: OptionsConfig,
  key: K,
) {
  const sub = resolveSubOptions(options, key);
  return {
    ...(options.overrides as any)?.[key],
    ...("overrides" in sub ? sub.overrides : {}),
  };
}
