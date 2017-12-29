var SerialPort = require('serialport');
var port = new SerialPort('/dev/ttyUSB0');

var Readline = SerialPort.parsers.Readline; // make instance of Readline parser
var parser = new Readline(); // make a new parser to read ASCII lines
port.pipe(parser); // pipe the serial stream to the parser

var ready = false;

port.on('data', (data) => {
    if(data.toString() === 'READY') {
      ready = true;
      console.log("Arduino ready!");
    }
    port.removeAllListeners();
});

module.exports = {

  send : function(val, callback) {
    if (!ready) {
      console.log("Serial com attempt when arduino wasn't ready!");
    } else {
      port.write(val);
      if(typeof callback === "function")
        callback(val);
    }
  },

  query : function(callback) {
    if (!ready) {
      console.log("Query attempt when arduino wasn't ready!");
    } else {
      port.write('G');
      port.on('data', (data) => {
        callback(data.toString());
        port.removeAllListeners();
      });
    }
  }
};
  