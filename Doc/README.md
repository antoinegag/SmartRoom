# Smartroom
This project is divided in multiple parts.

## ArduinoController
This is the code running on the an Arduino UNO microcontroller.
Used to read from the sensors (lights, temperature, humidity) and to send IR signals to the lights.

see [HARDWARE](HARDWARE.md) for more info

## ChromeDash
This is a little chrome add-on that adds a pop-up button which then let's you control the lights and see sensor data.

see [CHROMEDASH](CHROMEDASH.md) for more info

## Server
This Node JS application has 2 main use, exposing a JSON RESTful API that let's you interact with the sensor, lights, etc. and serve static files.

see [API](API.md) for more info on the API 

see [WEB](WEB.md) for more info on the Web interface 
