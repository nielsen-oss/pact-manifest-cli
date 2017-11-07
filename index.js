'use strict'

const program = require('commander')
const pkg = require('./package.json')

const manifestClient = require('./src/manifestClient')
const CliUtils = require('./src/cliUtils')
const utils = new CliUtils(program)

program
  .version(pkg.version)
  .usage('[command] <flags>')

program.command('generate')
  .description('generate a pact manifest file from all pact files')
  .option('-e, --base-path [base-path]',
    'A directory\'s base path for the pact files location. Defaults to current working dir.',
    process.env.MANIFEST_BASE_PATH)
  .option('-l, --pact-files-path <pact-files-path>',
    'A directory relative to --base-path option, to find pact files',
    process.env.MANIFEST_PACT_FILES)
  .option('-f, --manifest-file <manifest-file>',
    'The filename (or full path) to save the pact manifest file',
    process.env.MANIFEST_FILE)
  .option('-t, --pact-default-tag [pact-default-tag]',
    'The tag to assign by default to pact files when submitting them to broker. Defaults to "develop".',
    process.env.MANIFEST_DEFAULT_TAG)
  .action(async (options) => {
    const {pactFilesPath, manifestFile, basePath, pactDefaultTag} = options

    utils.checkMissingFlag('--pact-files-path', pactFilesPath)
    utils.checkMissingFlag('--manifest-file', manifestFile)

    try {
      await manifestClient.createManifest({
        basePath,
        manifestFile,
        pactFilesPath,
        pactDefaultTag
      })
      console.log('Successfully processed manifest: %s', manifestFile)
    } catch (err) {
      utils.handleError(err)
    }
  })

program.command('publish')
  .description('publishes pacts based on a pact manifest file')
  .option('-f, --manifest-file <manifest-file>',
    'The manifest file to process',
    process.env.MANIFEST_FILE)
  .option('-a, --consumer-app-version <consumer-app-version>',
    'The consumer application version',
    process.env.CONSUMER_APP_VERSION)
  .option('-e, --base-path [base-path]',
    'A directory\'s base path for the pact files location. Defaults to current working dir.',
    process.env.MANIFEST_BASE_PATH || process.cwd())
  .option('-b, --broker-base-url [broker-base-url]',
    'The base URL of the Pact Broker [url]. Defaults to "https://localhost".',
    process.env.BROKER_BASE_URL || 'https://localhost')
  .option('-n, --broker-username [broker-username]',
    'Pact Broker basic auth username [username]',
    process.env.BROKER_USERNAME)
  .option('-p, --broker-password [broker-password]',
    'Pact Broker basic auth password [password]',
    process.env.BROKER_USERNAME)
  .option('-t, --pact-tag [pact-tag]',
    'The tag of the pact files to publish. If omitted all the files will be published.',
    process.env.PACT_TAG)
  .action(async (options) => {
    const {basePath, consumerAppVersion, manifestFile, brokerBaseUrl, brokerUsername, brokerPassword, pactTag} = options

    utils.checkMissingFlag('--consumer-app-version', consumerAppVersion)
    utils.checkMissingFlag('--broker-base-url', brokerBaseUrl)
    utils.checkMissingFlag('--manifest-file', manifestFile)
    try {
      await manifestClient.publishManifest({
        basePath,
        brokerBaseUrl,
        brokerUsername,
        brokerPassword,
        consumerAppVersion,
        manifestFile,
        pactTag
      })
      console.log('Successfully published manifest: %s', manifestFile)
    } catch (err) {
      utils.handleError(err)
    }
  })

program.parse(process.argv)
