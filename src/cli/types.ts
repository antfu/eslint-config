export interface PromItem<T> {
  label: string
  value: T
  hint?: string
}

export enum Template {
  Vanilla = 'vanilla',
  React = 'react',
  Svelte = 'svelte',
  Astro = 'astro',
}

export enum Extra {
  Formatter = 'formatter',
  Perfectionist = 'perfectionist',
  UnoCSS = 'unocss',
}

export interface PromtResult {
  uncommittedConfirmed: boolean
  template: Template
  extra: Extra[]
  updateVscodeSettings: unknown
}
