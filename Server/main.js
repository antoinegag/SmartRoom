var express = require('express');
var app = express();

var bodyParser = require('body-parser');

var bot = require('./discord/bot');

//Register routes for the lights
var lightRoutes = require('./lights/routes');
lightRoutes(app);

//Register routes for the sensors
var sensorRoutes = require('./sensors/routes');
sensorRoutes(app)

// configure the app to use bodyParser()
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

//Startup the server
//Port 80 is redirected to port 3000
//sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3000
var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Server started on http://%s:%s", host, port)

})    