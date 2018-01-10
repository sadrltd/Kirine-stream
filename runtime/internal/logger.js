'use strict'
var Winston = require('winston')
var path = require('path')
var config = require('../../config.json')

Winston.emitErrs = true

var Logger

  Logger = new Winston.Logger({
    colors: {
      info: 'green',
      warn: 'yellow',
      error: 'red',
      debug: 'blue',
      silly: 'blue'
    },
    exitOnError: true
  })
}

exports.Logger = Logger
