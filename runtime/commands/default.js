var Commands = []
var request = require('superagent')
var config = require('../../config.json')
var Logger = require('../internal/logger.js').Logger
var argv = require('minimist')(process.argv.slice(2))

function getUptime () {
  var d = Math.floor(process.uptime() / 86400)
  var hrs = Math.floor((process.uptime() % 86400) / 3600)
  var min = Math.floor(((process.uptime() % 86400) % 3600) / 60)
  var sec = Math.floor(((process.uptime() % 86400) % 3600) % 60)

  if (d === 0 && hrs !== 0) {
    return `${hrs} hrs, ${min} mins, ${sec} seconds`
  } else if (d === 0 && hrs === 0 && min !== 0) {
    return `${min} mins, ${sec} seconds`
  } else if (d === 0 && hrs === 0 && min === 0) {
    return `${sec} seconds`
  } else {
    return `${d} days, ${hrs} hrs, ${min} mins, ${sec} seconds`
  }
}

Commands.ping = {
  name: 'ping',
  help: "I'll reply to you with pong!",
  timeout: 10,
  level: 0,
  fn: function (msg) {
    var initTime = new Date(msg.timestamp)
    msg.reply('Pong!').then((m) => {
      m.edit('<@' + msg.author.id + '>, Pong! Time taken: ' + Math.floor(new Date(m.timestamp) - initTime) + ' ms.')
    })
  }
}

Commands['join-server'] = {
  name: 'join-server',
  help: "I'll join the server you've requested me to join, as long as the invite is valid and I'm not banned of already in the requested server.",
  aliases: ['join', 'joinserver', 'invite'],
  usage: '<bot-mention> <instant-invite>',
  level: 0,
  fn: function (msg, suffix, bot) {
    if (bot.User.bot) {
      msg.channel.sendMessage("Sorry, bot accounts can't accept instant invites, instead, use my OAuth URL: <" + config.bot.oauth + '>')
    } else {
      Logger.warn('Using user accounts is deprecated!')
    }
  }
}

Commands.prefix = {
  name: 'prefix',
  help: "If you, despite reading this have no clue what my prefix is, I'll tell you!",
  timeout: 5,
  level: 0,
  fn: function (msg) {
    var datacontrol = require('../datacontrol')
    datacontrol.customize.getGuildData(msg).then(g => {
      if (g.customize.prefix) {
        msg.channel.sendMessage(`My prefix on this server is ${g.customize.prefix}`)
      } else {
        msg.channel.sendMessage(`My prefix is ${config.settings.prefix}`) // Default prefix, if none is set in customize
      }
    }).catch((error) => {
      Logger.error(error)
      msg.channel.sendMessage('Whoops, something went wrong.')
    })
  }
}

exports.Commands = Commands
