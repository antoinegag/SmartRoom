var serial = require('../sensors/serial');

/*
*   Interacts with the lights
*   Each function can be passed a callback
*/
module.exports = {

    turnOnOff : function(callback) {
        serial.send('O');
        if(typeof callback === "function") callback();
    },

    brightnessPlus : function(callback) {
        serial.send('P');
        if(typeof callback === "function") callback();
    },

    brightnessMinus : function(callback) {
        serial.send('M');
        if(typeof callback === "function") callback();
    },

    changeColor : function(callback) {
        serial.send('C');
        if(typeof callback === "function") callback();
    },

    setWhite : function(callback) {
        serial.send('W');
        if(typeof callback === "function") callback();
    },

    setSpace : function(callback) {
        serial.send('E');
        if(typeof callback === "function") callback();
    },

    setHell : function(callback) {
        serial.send('N');
        if(typeof callback === "function") callback();
    },
};