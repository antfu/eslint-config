/* eslint-disable no-console */
import process from 'node:process'
import c from 'picocolors'
import { hideBin } from 'yargs/helpers'
import yargs from 'yargs'
import { run } from './run'
import { CROSS, version } from './constants'

function header() {
  console.log(`\n${c.green(`@antfu/eslint-config `)}${c.dim(`v${version}`)}`)
}

const instance = yargs(hideBin(process.argv))
  .scriptName('@antfu/eslint-config')
  .usage('')
  .command(
    '*',
    'Run the initialization or migration',
    args => args
      .option('yes', { alias: 'y', description: 'Skip prompts and use default values', type: 'boolean' })
      .help(),
    async (args) => {
      header()
      console.log()
      try {
        await run(args)
      }
      catch (error) {
        console.error(c.inverse(c.red(' Failed to migrate ')))
        console.error(c.red(`${CROSS} ${String(error)}`))
        process.exit(1)
      }
    },
  )
  .showHelpOnFail(false)
  .alias('h', 'help')
  .version('version', version)
  .alias('v', 'version')

// eslint-disable-next-line no-unused-expressions
instance
  .help()
  .argv
