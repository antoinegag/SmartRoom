'use strict';
module.exports = function(app) {

    var serial = require('./serial');

    /*
    *   Returns a JSON object with raw reading from all sensors
    */
    app.get('/smartroom/api/sensors/getSensorData', function (req, res) {
            serial.query((data) => {
            var dataJson = JSON.parse(data);    
            var dataReturn = {
                "temperature" : dataJson[0],
                "analogTemperature" : dataJson[1],
                "lightLevel" : dataJson[2],
                "humidity" : dataJson[3]
            };
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(dataReturn, null, 3));
        });
    });
};