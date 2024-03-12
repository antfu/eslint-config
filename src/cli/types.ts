import type { Answers, Choice } from 'prompts'

export interface PromItem extends Choice {
  color: (str: string | number) => string
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

export type PromtResult = Answers<'uncommittedConfirmed' | 'template' | 'extra' | 'updateVscodeSettings'>
