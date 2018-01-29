var logger = require("../util/logging");

var fs = require('fs');
const Discord = require("discord.js");
var config = require("../util/configHandler");

const client = new Discord.Client({
  disableEveryone: true
});

const commands = require('./commands');

client.on('ready', () => {
  console.log(`Discord bot online as ${client.user.tag}!`);
  client.user.setStatus('online', 'Up and Ready');
  client.user.setGame("Up and ready!");
});

client.on('message', msg => {
  if (msg.content.startsWith(config.discord.key) || (msg.content.startsWith('<@396401258988175360>') && config.discord.pignable)) {
    commands.handle(msg, client);
  }
});

client.login(config.discord.token).catch((error) => {
  console.log(error);
  logger.log("ERROR", "Discord bot failed");
});
