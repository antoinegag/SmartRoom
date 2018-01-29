var Client = require('mariasql');

var config = require('../util/configHandler');

module.exports = {

    log : function(level, msg) {
        try {
            try {
                var c = new Client(config.database);
            } catch (error) {
                console.log("Error creating new database client");
                console.log(error);
            }

            c.query('INSERT INTO log (level, msg) VALUES ("'+ level + '","' + msg +'");', function(err, rows) {
                if (err)
                    throw err;
            });
                
            c.end();
        } catch (error) {
            console.log(error);
        }
    }
}