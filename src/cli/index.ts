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
    'migrate',
    'Migrate from legacy config to new flat config',
    args => args
      // .option('detail', {
      //   alias: 'a',
      //   default: false,
      //   describe: 'show more info',
      //   type: 'boolean',
      // })
      .help(),
    async (_args) => {
      header()
      console.log()
      try {
        await run()
      }
      catch (error) {
        console.error(c.inverse(c.red(' Failed to migrate ')))
        console.error(c.red(`${CROSS} ${String(error)}`))
        process.exit(1)
      }
    },
  )
  .command('*', false, args => args, () => {
    header()
    instance.showHelp()
  })
  .showHelpOnFail(false)
  .alias('h', 'help')
  .version('version', version)
  .alias('v', 'version')

// eslint-disable-next-line no-unused-expressions
instance
  .help()
  .argv
