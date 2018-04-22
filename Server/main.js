var fs = require('fs');

var os = require('os');
var ifaces = os.networkInterfaces();

var config = require("./util/configHandler");
var cmd = require('node-cmd');

var express;
var app;
var bodyParser;

if(config.stream || config.serve_static || config.api.active) {
  
  express = require('express');
  app = express();

  if(config.listen_on.port != 80 && config.listen_on.reroute) {
    console.log("Redirecting port 80 to " + config.listen_on.port);

    //FIXME: This is one dirty hack
    cmd.run('sudo iptables -t nat -A PREROUTING -i ' + config.listen_on.inteface + ' -p tcp --dport 80 -j REDIRECT --to-port ' + config.listen_on.port);
  }

  if(config.serve_static) {
    console.log("Mapping /html/ to /smartroom/ for static files serving");
    app.use('/smartroom/', express.static(config.static_path));
  }

  if(config.api.active) {

    bodyParser = require('body-parser');

    // configure the app to use bodyParser()
    app.use(bodyParser.urlencoded({
      extended: true
    }));

    app.use(bodyParser.json());

    //Register routes for historical data
    console.log("Registering historic routes");
    var historicRoutes = require('./database/routes');
    historicRoutes(app, config.api.sampling);


    if(config.api.sensors) {
      //Register routes for the sensors
      console.log("Registering sensor routes");
      var sensorRoutes = require('./sensors/routes');
      sensorRoutes(app);
    }

    if(config.api.lights) {
      //Register routes for the lights
      console.log("Registering lights routes");
      var lightRoutes = require('./lights/routes');
      lightRoutes(app);
    }
  }

  //Startup the server
  var server = app.listen(config.listen_on.port, ifaces[config.listen_on.interface][0].address, function () { 
    console.log("Server started on http://%s:%s", server.address().address, server.address().port);
  });
}

if(config.discord) {
  var bot = require('./discord/bot');
}

require("./util/logging").log("INFO", "SmartRoom Started");


