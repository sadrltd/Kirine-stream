'use strict'
process.title = 'kirine'

var Config

try {
  Config = require('./config.json')
} catch (e) {
  console.log('\We have encountered an error while trying to load the config file, please resolve this issue and restart Kirine\n\n' + e.message)
  process.exit()
}
var Discordie = require('discordie')
var Event = Discordie.Events
var bot
var runtime = require('./runtime/runtime.js')
var timeout = runtime.internal.timeouts
var commands = runtime.commandcontrol.Commands
var aliases = runtime.commandcontrol.Aliases
var datacontrol = runtime.datacontrol

Logger.info('Initializing...')

if (argv.shardmode && !isNaN(argv.shardid) && !isNaN(argv.shardcount)) {
  Logger.info('Starting in ShardMode, this is shard ' + argv.shardid, {
    shardInfo: [argv.shardcount, argv.shardid]
  })
  bot = new Discordie({
    shardId: argv.shardid,
    shardCount: argv.shardcount
  })
} else {
  bot = new Discordie()
}

start()

  Logger.info('Ready to start!', {
    botID: bot.User.id,
    version: require('./package.json').version
  })

function start () {
  try {
    Config = require('./config.json')
  } catch (e) {
    Logger.error('Config error: ' + e)
    process.exit(0)
  }
  bot.connect({
    token: Config.bot.token
  })
}
