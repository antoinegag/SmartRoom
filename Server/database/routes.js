var Client = require('mariasql');
var schedule = require('node-schedule');

var serial = require('../sensors/serial');
var lights = require('../lights/lights');

var config = require('../util/configHandler');


function scheduleSampling() {
    schedule.scheduleJob('*/30 * * * *', function() {

        try {
    
        serial.query((data) => {
            var dataJson;
            try {
                dataJson = JSON.parse(data); 
            } catch (error) {
                console.log("Unable to parse data");
                console.log(error);
                return;
            }
    
            try {
                var c = new Client(config.database);
            } catch (error) {
                console.log("Error creating new client");
                console.log(error);
            }
    
            c.query('INSERT INTO light (value) VALUES ('+ dataJson[2] +');', function(err, rows) {
                if (err)
                    throw err;
            });
        
            c.query('INSERT INTO temperature (value) VALUES ('+ dataJson[1] +');', function(err, rows) {
                if (err)
                    throw err;
            });
                
            c.end();
        });
    
        } catch (error) {
            console.log(error);
        }
    });
}

module.exports = function(app, shouldSample) {

    app.get('/smartroom/api/historic/light', (req, res) => sendHistoric("light", req, res));

    app.get('/smartroom/api/historic/temperature',(req, res) => sendHistoric("temperature", req, res));

    if(shouldSample) {
        scheduleSampling();
    }
};

function sendHistoric(table, req, res) {
    try {
        var c = new Client(config.database);
        
        c.query('SELECT * FROM ' + table, function(err, rows) {
            if (err)
                throw err;
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(rows, null, 3));
        });
          
        c.end();
    } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({"message" : "error"}, null, 3));
    }  
}