document.getElementById("onoff").addEventListener("click",function(){send('onoff')});
document.getElementById("b_minus").addEventListener("click",function(){send('bminus')});
document.getElementById("b_plus").addEventListener("click",function(){send('bplus')});
document.getElementById("ww").addEventListener("click",function(){send('white')});
document.getElementById("c_color").addEventListener("click",function(){send('cc')});

$(document).ready(function(){
    update();
});

function send(action){
    $.get("http://pokepi/smartroom/api/lights/send/" + action);
}

function update() {

    $.get("http://pokepi/smartroom/api/sensors/getSensorData", function(data, status){    
        $("#temp").html("Temperature: " + data["analogTemperature"] + "	&#8451;");
        $("#hum").text("Humidity: " + data["humidity"] + "%");
        $("#light").text("Light: " + data["lightLevel"]/10 + "%" );
    });
    setTimeout(update, 1000);
}

