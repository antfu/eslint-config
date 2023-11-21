import process from 'node:process'
import { isPackageExists } from 'local-pkg'
import type { Awaitable, UserConfigItem } from './types'

/**
 * Combine array and non-array configs into a single array.
 */
export async function combine(...configs: Awaitable<UserConfigItem | UserConfigItem[]>[]): Promise<UserConfigItem[]> {
  const resolved = await Promise.all(configs)
  return resolved.flat()
}

export function renameRules(rules: Record<string, any>, from: string, to: string) {
  return Object.fromEntries(
    Object.entries(rules)
      .map(([key, value]) => {
        if (key.startsWith(from))
          return [to + key.slice(from.length), value]
        return [key, value]
      }),
  )
}

export function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value]
}

export async function interopDefault<T>(m: Awaitable<T>): Promise<T extends { default: infer U } ? U : T> {
  const resolved = await m
  return (resolved as any).default || resolved
}

export async function ensurePackages(packages: string[]) {
  if (process.env.CI || process.stdout.isTTY === false)
    return

  const nonExistingPackages = packages.filter(i => !isPackageExists(i))
  if (nonExistingPackages.length === 0)
    return

  const { default: prompts } = await import('prompts')
  const { result } = await prompts([
    {
      message: `${nonExistingPackages.length === 1 ? 'Package is' : 'Packages are'} required for this config: ${nonExistingPackages.join(', ')}. Do you want to install them?`,
      name: 'result',
      type: 'confirm',
    },
  ])
  if (result)
    await import('@antfu/install-pkg').then(i => i.installPackage(nonExistingPackages, { dev: true }))
}
