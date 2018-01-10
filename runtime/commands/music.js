'use strict'
var v = require('../internal/voice.js')
var checkLevel = require('../databases/controllers/permissions.js').checkLevel
var Commands = []

Commands.music = {
  name: 'music',
  help: "I'll pause or play the music, just tell me what after the command!",
  aliases: ['pauseplay', 'playpause'],
  noDM: true,
  level: 1,
  fn: function (msg, suffix, bot) {
    v.music(msg, suffix, bot)
  }
}

Commands.volume = {
  name: 'volume',
  help: "I'll change my volume or return the current volume if you don't provide a number!",
  usage: '<nothing/number>',
  aliases: ['vol'],
  noDM: true,
  level: 1,
  fn: function (msg, suffix, bot) {
    v.volume(msg, suffix, bot).then(v => {
      msg.channel.sendMessage(v)
    }).catch(err => {
      msg.channel.sendMessage(err)
    })
  }
}

Commands.voice = {
  name: 'voice',
  help: "I'll join a voice channel!",
  aliases: ['join-voice'],
  noDM: true,
  timeout: 10,
  level: 1,
  fn: function (msg, suffix, bot) {
    v.join(msg, suffix, bot)
  }
}

Commands.request = {
  name: 'request',
  help: 'Use this to request songs!',
  aliases: ['queue'],
  noDM: true,
  usage: 'link',
  timeout: 10,
  level: 1,
  fn: function (msg, suffix, bot) {
    if (!suffix) {
      msg.reply('Please enter something to search for!')
    }
    var u = require('url').parse(suffix)
    if (u.host === null) {
      v.request(msg, 'ytsearch:' + suffix, bot)
    } else {
      v.request(msg, suffix, bot)
    }
  }
}

exports.Commands = Commands
