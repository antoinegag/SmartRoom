var serial = require('../sensors/serial');
var lights = require('../lights/lights');

var commandRegistry = {
    'data' : (msg, client) => {sendData(msg, client)},
    'lights' : (msg, client) => {sendLightRemote(msg, client)}
};

module.exports = {

    handle : function(msg, client, callback) {
        try {
            var command = msg.content.split(" ");
            commandRegistry[command[1]](msg, client);
        } catch (error) {
            msg.channel.send("Unknown command " + command[1]);
        }
        if(typeof callback === "function") callback();
    }

};

function sendData(msg, client) {
    serial.query((data) => {
        try {
            var dataJson = JSON.parse(data); 
            var desc = "Temperature: " + dataJson[1] + "°C\nLight Level: " + dataJson[2]/10 + "%\nHumidity: " + dataJson[3] + "%";
        } catch (error) {
            var desc = "Error";
        }
        
        msg.channel.send({ embed: {
            title: "Sensor Data " + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
            color: 3447003,
            description: desc
        }});
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