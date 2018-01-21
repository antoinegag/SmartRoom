var config;

var fs = require('fs');

try {
  config = require('../config.json');  
} catch (error) {
  console.log("Couldn't load config file, generating from blank one");
  var data = fs.readFileSync('blankConfig.json', 'utf8');
  fs.writeFileSync('config.json', data,'utf8');
  console.log("Generated config file");
  console.log("Update it and relaunch!");
  process.exit();
};

module.exports = config;


  