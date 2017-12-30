var fs = require('fs');
const Discord = require("discord.js");
const client = new Discord.Client({
  disableEveryone: true
});

const config = require('./config.json');

/*
try {
  
} catch (error) {
  
  console.log("Couldn't load config file, generating from blank one");
  
  fs.readFile('blankConfig.json', 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    fs.writeFile('config.json', data, 'utf8');
    console.log("Config file generated!");
  });
  
}
*/

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
