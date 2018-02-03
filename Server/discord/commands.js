var serial = require('../sensors/serial');
var lights = require('../lights/lights');
var crypto = require('./crypto/cryptoCommands');
const axios = require('axios');
var RaspiCam = require("raspicam");
var config = require("../util/configHandler");

var commandRegistry = {
    'help' : (msg, client) => { sendHelp(msg, client) },
    'data' : (msg, client) => { sendData(msg, client) },
    'lights' : (msg, client) => { sendLightRemote(msg, client) },
    'val' : (msg, client) => { crypto.sendCryptVal(msg, client) },
    'market' : (msg, client) => { crypto.sendMarket(msg, client) },
    'tell': (msg, client) => {  crypto.tellValue(msg, client) },
    'printer' : (msg, client) => { sendPrinter(msg,client) },
    'light' : (msg, client) => { setLight(msg, client)}
};

module.exports = {

    handle : function(msg, client, callback) {
        var command = msg.content.split(" ");
        try {
            commandRegistry[command[1]](msg, client);
        } catch (error) {
            msg.channel.send("Error with command " + command[1]);
            console.log("Error with " + command);
            console.log(error);
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

function sendPrinter(msg, client) {

    //str.replace(/[^a-z0-9]/gi, '_').toLowerCase();

    if(!config.perms.admin.includes(msg.author.id)) {
        msg.channel.send("You don't have the require permissions do execute that command.");
        return;
    }

    msg.channel.startTyping();
    var camera = new RaspiCam({
        mode: "photo",
        output: "./pictures/cam.jpg",
        encoding: "jpg",
        timeout: 0, // take the picture immediately
        hf: true,
        vf: true,
        h:2304,
        w:3456
    });
    
    camera.on("read", function( err, timestamp, filename ){
        msg.channel.stopTyping();
        msg.channel.send(``, {
            files: [
              "./pictures/cam.jpg"
            ]
          });
          camera.stop();
    });
    
    camera.start();
}

function setLight(msg, client) {
    if(!config.perms.admin.includes(msg.author.id)) {
        msg.channel.send("You don't have the require permissions do execute that command.");
        return;
    }

    var params = msg.content.split(' ');
    params.shift();
    params.shift();

    switch(params[0]) {
        case "plus":
            lights.brightnessPlus();
            msg.channel.send("Ok, increased brightness.");
            break;
        case "minus":
            lights.brightnessMinus();
            msg.channel.send("Ok, turned down the lights.");
            break;
        case "on":
            lights.turnOnOff();
            msg.channel.send("Ok, changed light state.");
            break;
        case "off":
            lights.turnOnOff();
            msg.channel.send("Ok, changed light state.");
            break;
        case "color":
            lights.changeColor();
            msg.channel.send("Ok, changed light color.");
            break;
        case "white":
            lights.setWhite();
            msg.channel.send("Ok, set light to white.");
            break;
        default:
            //Todo: dynamic help
            var body = [
                {
                    name:"Usage",
                    value: "light [command]"
                },
                {
                    name: "help",
                    value: "Display help"
                },
                {
                    name: "plus",
                    value: "Brightness +"
                },
                {
                    name: "minus",
                    value: "Brightness -"
                },
                {
                    name: "on | off",
                    value: "Turns the lights on/off"
                },
                {
                    name: "color",
                    value: "Change light color"
                },
                {
                    name: "white",
                    value: "Set the light color to white"
                }
            ]

            msg.channel.send({
                    embed: {
                        title: 'Light Help',
                        color: 3447003,
                        description: "Help for command help",
                        fields: body,
                    }
            });
    }  
}