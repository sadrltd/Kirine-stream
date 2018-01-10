'use strict'
process.title = 'kirine'

var Config

try {
  Config = require('./config.json')
} catch (e) {
  console.log('\nWildBeast encountered an error while trying to load the config file, please resolve this issue and restart WildBeast\n\n' + e.message)
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

bot.Dispatcher.on(Event.GATEWAY_READY, function () {
  bot.Users.fetchMembers()
  runtime.internal.versioncheck.versionCheck(function (err, res) {
    if (err) {
      Logger.error('Version check failed, ' + err)
    } else if (res) {
      Logger.info(`Version check: ${res}`)
    }
  })
  Logger.info('Ready to start!', {
    botID: bot.User.id,
    version: require('./package.json').version
  })
  Logger.info(`Logged in as ${bot.User.username}#${bot.User.discriminator} (ID: ${bot.User.id}) and serving ${bot.Users.length} users in ${bot.Guilds.length} servers.`)
  if (argv.shutdownwhenready) {
    console.log('o okei bai')
    process.exit(0)
  }
})

bot.Dispatcher.on(Event.GATEWAY_RESUMED, function () {
  Logger.info('Connection to the Discord gateway has been resumed.')
})

bot.Dispatcher.on(Event.DISCONNECTED, function (e) {
  Logger.error('Disconnected from the Discord gateway: ' + e.error)
  Logger.info('Trying to login again...')
  start()
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
