var serial = require('../sensors/serial');
var lights = require('../lights/lights');
var crypto = require('./crypto/cryptoCommands');
const axios = require('axios');

var commandRegistry = {
    'help' : (msg, client) => { sendHelp(msg, client) },
    'data' : (msg, client) => { sendData(msg, client) },
    'lights' : (msg, client) => { sendLightRemote(msg, client) },
    'val' : (msg, client) => { crypto.sendCryptVal(msg, client) },
    'market' : (msg, client) => { crypto.sendMarket(msg, client) },
    'tell': (msg, client) => {  crypto.tellValue(msg, client) }
};

module.exports = {

    handle : function(msg, client, callback) {
        var command = msg.content.split(" ");
        try {
            commandRegistry[command[1]](msg, client);
        } catch (error) {
            msg.channel.send("Error with command" + command[1]);
        }
        if(typeof callback === "function") callback();
    }

};

function sendHelp(msg, client) {

    //Todo: dynamic help
    var body = [
        {
            name: "help",
            value: "Display help"
        },
        {
            name: "data",
            value: "shows sensor data"
        },
        {
            name: "val",
            value: "gives the value of the currency\nUsage: val CURRENCY"
        },
        {
            name: "market",
            value: "shows market price of currencies\nUsage: market help"
        },
        {
            name: "tell",
            value: "gives the value of the currency, in TTS\nUsage: tell CURRENCY"
        },
    ]

    msg.channel.send({
            embed: {
                title: 'Market Help',
                color: 3447003,
                description: "Help for command Market",
                fields: body,
            }
    });
}

function sendData(msg, client) {
    serial.query((data) => {
        try {
            var dataJson = JSON.parse(data); 
            var desc = "Temperature: " + dataJson[1] + "°C\nLight Level: " + (dataJson[2]/5.3).toFixed() + "%\nHumidity: " + dataJson[3] + "%";
        } catch (error) {
            var desc = "Error";
        }
        
        msg.channel.send({ 
            embed: {
                title: "Sensor Data " + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
                color: 3447003,
                description: desc
            }
        });
    });
};

function sendLightRemote(msg, client) {
    msg.channel.send({ embed: {
        title: "Light Remote",
        color: 3447003,
        description: "⬇ decrease brightness\n" +
                     "⬆ increase brightness\n" +
                     "🇨 change color\n" +
                     "⏯ on/off"
    }}).then(function(msg) {
        msg.react("⬇");
        msg.react("⬆");
        msg.react("🇨");
        msg.react("⏯");
    });
};