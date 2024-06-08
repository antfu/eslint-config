import { isPackageExists } from "local-pkg";
import { ensurePackages, interopDefault, toArray } from "../utils";
import type { OptionsFiles, OptionsOverrides, OptionsTypeScriptWithTypes, TypedFlatConfigItem } from "../types";
import { GLOB_JS, GLOB_JSX, GLOB_TS, GLOB_TSX } from "../globs";
import { fixupConfigRules } from "@eslint/compat";
import { a11y } from "./a11y";
import { compat } from "../compat";

// react refresh
const ReactRefreshAllowConstantExportPackages = [
  "vite",
];
const RemixPackages = [
  "@remix-run/node",
  "@remix-run/react",
  "@remix-run/serve",
  "@remix-run/dev",
];
const NextJsPackages = [
  "next",
];

export async function react(
  options: OptionsTypeScriptWithTypes & OptionsOverrides & OptionsFiles = {},
): Promise<Array<TypedFlatConfigItem>> {
  const {
    files = [GLOB_JS, GLOB_JSX, GLOB_TS, GLOB_TSX],
    overrides = {},
  } = options;

  await ensurePackages([
    "@eslint-react/eslint-plugin",
    "eslint-plugin-react-hooks",
    "eslint-plugin-react-refresh",
    "eslint-plugin-react",
  ]);

  const isUsingNext = NextJsPackages.some(i => isPackageExists(i));

  if (isUsingNext) {
    await ensurePackages(
      ["@next/eslint-plugin-next"],
    );
  }

  const tsconfigPath = options?.tsconfigPath
    ? toArray(options.tsconfigPath)
    : undefined;
  const isTypeAware = Boolean(tsconfigPath);

  const [
    pluginReact,
    pluginReactHooks,
    pluginReactRefresh,
    parserTs,
  ] = await Promise.all([
    interopDefault(import("@eslint-react/eslint-plugin")),
    interopDefault(import("eslint-plugin-react-hooks")),
    interopDefault(import("eslint-plugin-react-refresh")),
    interopDefault(import("@typescript-eslint/parser")),
  ] as const);

  const isAllowConstantExport = ReactRefreshAllowConstantExportPackages.some(i => isPackageExists(i));
  const isUsingRemix = RemixPackages.some(i => isPackageExists(i));

  const { plugins } = pluginReact.configs.all;

  return [
    {
      name: "antfu/react/setup",
      plugins: {
        "@eslint-react": plugins["@eslint-react"],
        "@eslint-react/dom": plugins["@eslint-react/dom"],
        "react-hooks": pluginReactHooks,
        "@eslint-react/hooks-extra": plugins["@eslint-react/hooks-extra"],
        "@eslint-react/naming-convention": plugins["@eslint-react/naming-convention"],
        "react-refresh": pluginReactRefresh,
      },
    },
    {
      files,
      languageOptions: {
        parser: parserTs,
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
          ...isTypeAware ? { project: tsconfigPath } : {},
        },
        sourceType: "module",
      },
      name: "antfu/react/rules",
      rules: {
        // recommended rules from @eslint-react/dom
        "@eslint-react/dom/no-children-in-void-dom-elements": "warn",
        "@eslint-react/dom/no-dangerously-set-innerhtml": "warn",
        "@eslint-react/dom/no-dangerously-set-innerhtml-with-children": "error",
        "@eslint-react/dom/no-find-dom-node": "error",
        "@eslint-react/dom/no-missing-button-type": "warn",
        "@eslint-react/dom/no-missing-iframe-sandbox": "warn",
        "@eslint-react/dom/no-namespace": "error",
        "@eslint-react/dom/no-render-return-value": "error",
        "@eslint-react/dom/no-script-url": "warn",
        "@eslint-react/dom/no-unsafe-iframe-sandbox": "warn",
        "@eslint-react/dom/no-unsafe-target-blank": "warn",

        // recommended rules react-hooks
        "react-hooks/exhaustive-deps": "warn",
        "react-hooks/rules-of-hooks": "error",

        // react refresh
        "react-refresh/only-export-components": [
          "warn",
          {
            allowConstantExport: isAllowConstantExport,
            allowExportNames: [
              ...(isUsingNext
                ? [
                    "config",
                    "generateStaticParams",
                    "metadata",
                    "generateMetadata",
                    "viewport",
                    "generateViewport",
                  ]
                : []),
              ...(isUsingRemix
                ? [
                    "meta",
                    "links",
                    "headers",
                    "loader",
                    "action",
                  ]
                : []),
            ],
          },
        ],

        // recommended rules from @eslint-react
        "@eslint-react/ensure-forward-ref-using-ref": "warn",
        "@eslint-react/no-access-state-in-setstate": "error",
        "@eslint-react/no-array-index-key": "warn",
        "@eslint-react/no-children-count": "warn",
        "@eslint-react/no-children-for-each": "warn",
        "@eslint-react/no-children-map": "warn",
        "@eslint-react/no-children-only": "warn",
        "@eslint-react/no-children-prop": "warn",
        "@eslint-react/no-children-to-array": "warn",
        "@eslint-react/no-clone-element": "warn",
        "@eslint-react/no-comment-textnodes": "warn",
        "@eslint-react/no-component-will-mount": "error",
        "@eslint-react/no-component-will-receive-props": "error",
        "@eslint-react/no-component-will-update": "error",
        "@eslint-react/no-create-ref": "error",
        "@eslint-react/no-direct-mutation-state": "error",
        "@eslint-react/no-duplicate-key": "error",
        "@eslint-react/no-implicit-key": "error",
        "@eslint-react/no-missing-key": "error",
        "@eslint-react/no-nested-components": "warn",
        "@eslint-react/no-redundant-should-component-update": "error",
        "@eslint-react/no-set-state-in-component-did-mount": "warn",
        "@eslint-react/no-set-state-in-component-did-update": "warn",
        "@eslint-react/no-set-state-in-component-will-update": "warn",
        "@eslint-react/no-string-refs": "error",
        "@eslint-react/no-unsafe-component-will-mount": "warn",
        "@eslint-react/no-unsafe-component-will-receive-props": "warn",
        "@eslint-react/no-unsafe-component-will-update": "warn",
        "@eslint-react/no-unstable-context-value": "error",
        "@eslint-react/no-unstable-default-props": "error",
        "@eslint-react/no-unused-class-component-members": "warn",
        "@eslint-react/no-unused-state": "warn",
        "@eslint-react/no-useless-fragment": "warn",
        "@eslint-react/prefer-destructuring-assignment": "warn",
        "@eslint-react/prefer-shorthand-boolean": "warn",
        "@eslint-react/prefer-shorthand-fragment": "warn",

        ...isTypeAware
          ? {
              "@eslint-react/no-leaked-conditional-rendering": "warn",
            }
          : {},

        // overrides
        ...overrides,
      },
    },
    ...fixupConfigRules(
      compat.config({
        extends: ["plugin:ssr-friendly/recommended"],
        rules: {
          "ssr-friendly/no-dom-globals-in-react-cc-render": "off", // I don't use class components
        },
      }),
    ),
    ...compat.config({
      extends: "plugin:react/recommended",
      rules: {
        // #region react
        "react/jsx-no-leaked-render": [
          "error",
          { validStrategies: ["ternary"] },
        ],

        // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-sort-props.md
        "react/jsx-sort-props": [
          "error",
          {
            callbacksLast: true,
            shorthandFirst: true,
            // "shorthandLast": <boolean>,
            // "ignoreCase": <boolean>,
            noSortAlphabetically: true,
            reservedFirst: true,
          },
        ],
        "react/jsx-key": [
          1,
          { checkFragmentShorthand: true, checkKeyMustBeforeSpread: true },
        ],
        "react/display-name": 0,
        "react/prop-types": 0,
        "react/jsx-pascal-case": [
          2,
          {
            allowLeadingUnderscore: true,
            allowNamespace: true,
          },
        ],
        "react/jsx-no-constructed-context-values": 2,
        "react/jsx-no-useless-fragment": 2,
        "react/jsx-handler-names": 2,
        "react/jsx-no-duplicate-props": 2,
        "react/jsx-curly-brace-presence": [
          2,
          { props: "never", children: "never" },
        ],

        // As of React 16.14 and 17
        // https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#eslint
        "react/react-in-jsx-scope": 0,
        "react/jsx-uses-react": 0,

        // #endregion react
      },
    }),
    ...compat.extends("plugin:react/jsx-runtime"),
    ...isUsingNext
      ? fixupConfigRules(
        compat.extends(
          "plugin:@next/next/recommended",
          "plugin:@next/next/core-web-vitals",
        ),
      )
      : [],
    ...a11y(),
  ];
}
