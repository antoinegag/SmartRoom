var fs = require('fs');
const Discord = require("discord.js");
const client = new Discord.Client({
  disableEveryone: true
});

var config;

try {
  config = require('./config.json');  
} catch (error) {
  
  console.log("Couldn't load config file, generating from blank one");
  var data = fs.readFileSync('blankConfig.json', 'utf8');
  fs.writeFileSync('config.json', data,'utf8');
  console.log("Generated config file for discord");
  console.log("Update it and relaunch!");
  process.exit();
};

const commands = require('./commands');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setStatus('online', 'Up and Ready');
  client.user.setGame("Up and ready!");
});

client.on('message', msg => {
  if (msg.content.startsWith(config["key"]) || (msg.content.startsWith('<@396401258988175360>') && config["pignable"])) {
    commands.handle(msg, client);
  }
});

client.login(config['token']);
