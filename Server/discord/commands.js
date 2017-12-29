var serial = require('../sensors/serial');
var lights = require('../lights/lights');

var commands = {
    'data' : (msg, client) => {

        serial.query((data) => 
        {
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
    }
}

module.exports = {

    handle : function(msg, client, callback) {
        var command = msg.content.split(" ");
        commands[command[1]](msg, client);
        if(typeof callback === "function") callback();
    }

}