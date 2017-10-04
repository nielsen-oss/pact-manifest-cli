'use strict'

module.exports = class utils {
  constructor (program) {
    this.program = program
  }

  checkMissingFlag (flagName, flagValue) {
    if (!flagValue) {
      console.error('  error: option `%s\' argument missing, got `%s\'', flagName, flagValue)
      this.program.help()
    }
  }

  handleError (err) {
    if (err && err.message) {
      console.error('  error: %s', err.message)
      this.program.help()
    }
  }
}
