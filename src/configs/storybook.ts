import {ensurePackages} from '../utils'
import type {TypedFlatConfigItem} from '../types'
import {fixupConfigRules} from "@eslint/compat";
import {compat} from "../compat";


export async function storybook(
): Promise<TypedFlatConfigItem[]> {

    await ensurePackages([
        'eslint-plugin-storybook',
    ])

    return [{
        name: "nirtamir2/storybook",
        ...fixupConfigRules(
            compat.config({
            extends: [
                "plugin:storybook/recommended",
                "plugin:storybook/csf-strict",
                "plugin:storybook/addon-interactions",
            ],
            // .eslintignore is not supported with flat config, make sure to ignore also other build and test folders
            ignorePatterns: ["!.storybook", "storybook-static"],
        }),
    )
    },           {
        name: "nirtamir2/storybook/i18n",
        files: ["**.stories.tsx"],
        rules: {
            "i18next/no-string-literal": "off",
        },
    }
    ];
}
