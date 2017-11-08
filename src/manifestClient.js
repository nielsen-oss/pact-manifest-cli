'use strict'

const fs = require('fs')
const {promisify} = require('util')

const ManifestManager = require('pact-manifest').ManifestManager
const ManifestPublisher = require('pact-manifest').ManifestPublisher
const readFileAsync = promisify(fs.readFile)

module.exports = class ManifestClient {
  static publishManifest (options = {}) {
    return readFileAsync(options.manifestFile)
      .then((manifest) => {
        return ManifestManager.getManifestsByTag(options.basePath, JSON.parse(manifest), options.pactTag)
      })
      .then((manifestByTag) => {
        let publishedPacts = []
        for (let [tag, pactFiles] of Object.entries(manifestByTag)) {
          const manifestPublisher = new ManifestPublisher({
            pactFiles: pactFiles,
            broker: {
              pactBroker: options.brokerBaseUrl,
              pactBrokerUsername: options.brokerUsername,
              pactBrokerPassword: options.brokerPassword
            },
            consumerVersion: options.consumerAppVersion,
            tags: [tag]
          })

          publishedPacts.push(manifestPublisher.publish())
        }

        return Promise.all(publishedPacts)
      })
  }

  static createManifest (options = {}) {
    const manifestManager = new ManifestManager({
      basePath: options.basePath,
      manifestFile: options.manifestFile,
      pactFilesPath: options.pactFilesPath,
      pactDefaultTag: options.pactDefaultTag
    })

    return manifestManager.createManifest()
  }
}
