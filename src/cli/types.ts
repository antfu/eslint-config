export interface PromItem<T> {
  label: string
  value: T
  hint?: string
}

export type FrameworkOption = 'vue' | 'react' | 'svelte' | 'astro' | 'solid' | 'slidev'

export type ExtraLibrariesOption = 'formatter' | 'unocss'

export type LintOption = 'keep' | 'check' | 'fix'

export interface PromptResult {
  uncommittedConfirmed: boolean
  frameworks: FrameworkOption[]
  extra: ExtraLibrariesOption[]
  updateVscodeSettings: unknown
  lint: LintOption
}
