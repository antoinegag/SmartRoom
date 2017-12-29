'use strict';

var lights = require('./lights.js');

var actions = {
    'onoff'     : () => lights.turnOnOff(),
    'bplus'     : () => lights.brightnessPlus(),
    'bminus'    : () => lights.brightnessMinus(),
    'cc'        : () => lights.changeColor(),
    'white'     : () => lights.setWhite(),
    'hell'      : () => lights.setHell(),
    'space'     : () => lights.setSpace()
}

module.exports = function(app) {

    app.get('/smartroom/api/lights/send/:action', function (req,res) {
        try {
            actions[req.params.action.toLowerCase()]();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({"message" : "success"}, null, 3))
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({"message" : "error"}, null, 3))
        }                
    });
    
    app.get('/smartroom/api/lights/getPoweredState', function (req,res) {
        serial.query((data) => {
            var dataJson = JSON.parse(data);    
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({"state": dataJson[2] > 15}, null, 3));
        });
    });
};