var data = require("./data.json");
var fs = require("fs");
const axios = require('axios');

module.exports = {

sendCryptVal: (msg, client) => {
    var params = msg.content.split(' ');
    params.shift();
    params.shift();
    axios.get('https://min-api.cryptocompare.com/data/price?fsym=' + params[0] + '&tsyms=CAD,USD')
    .then(response => {

        var body = [
            {
                name: "USD",
                value: response.data["USD"].toString()
            },
            {
                name: "CAD",
                value: response.data["CAD"].toString()
            }
        ]

    msg.channel.send({
            embed: {
                title: params[0] + ' @ ' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
                color: 3447003,
                description: "\n",
                fields: body,
                footer: {
                    text: "Data from Cryptocompare"
                }
            }
        })
    }).catch(error => {
        msg.channel.send("Error with params " + params);
        console.log(error);
    });
},

tellValue: (msg, client) => {
    var params = msg.content.split(' ');
    params.shift();
    params.shift();
    axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=' + params[0] + '&tsyms=USD,CAD')
    .then(response => {
        msg.channel.send(params[0] + " " + response.data.XLM.CAD.toString() + " CAD", {tts : true});
    });
},


sendMarket: (msg, client) => {
    var params = msg.content.split(' ');
    params.shift();
    params.shift();

    if(params[0] === "help") {
        var body = [
            {
                name: "help",
                value: "Display help"
            },
            {
                name: "add VALUE",
                value: "Adds VALUE to the market list"
            },
            {
                name: "remove VALUE",
                value: "removes VALUE from market list"
            },
            {
                name: "dump",
                value: "list all the currencies on the market"
            }
        ]

        msg.channel.send({
                embed: {
                    title: 'Market Help',
                    color: 3447003,
                    description: "Help for command Market",
                    fields: body
                }
        });
        return;
    }

    if(params[0] === "add") {

        if(params[1] != undefined) {
            if(data.subscribe.indexOf(params[1]) > -1) {
                msg.channel.send(params[1] + " is already in the market");
                return;
            }
            data.subscribe.push(params[1]);
            fs.writeFileSync('./discord/crypto/data.json', JSON.stringify(data, null, 2) , 'utf-8');
            msg.channel.send("Added " + params[1] + " to market");
        } else {
            msg.channel.send("Missing paramter: currency to add");
        }
        return;
    } 

    if(params[0] === "remove") {
        if(params[1] != undefined) {
            var index = data.subscribe.indexOf(params[1]);
            if(!(index > -1)) {
                msg.channel.send(params[1] + " is not in the market");
                return;
            }
            data.subscribe.splice(index,1);
            fs.writeFileSync('./discord/crypto/data.json', JSON.stringify(data, null, 2) , 'utf-8');
            msg.channel.send("Removed " + params[1] + " from market");
        } else {
            msg.channel.send("Missing paramter: currency to remove");
        }
        return;
    }

    if(params[0] === "dump") {
        msg.channel.send("```json\n" + JSON.stringify(data.subscribe, null, 2) + "```");
        return;
    }

    axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=' + data.subscribe.join(',') + '&tsyms=USD,CAD')
    .then(response => {

        var body = [];

        for(var i in data.subscribe) {
            try {
                body.push({
                    name: data.subscribe[i],
                    value: "CAD: " + response.data[data.subscribe[i]].CAD.toString() + "\nUSD: " + response.data[data.subscribe[i]].USD.toString()
                })
            } catch (error) {
                console.log(error);
            }
        }

        msg.channel.send({
                embed: {
                    title: 'Market @ ' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
                    color: 3447003,
                    description: "\n",
                    fields: body,
                    footer: {
                        text: "Data from Cryptocompare"
                    }
                }
        });
    }).catch(error => {
        msg.channel.send("Error with params " + params);
        console.log(error);
    });
}

}; //Module exports