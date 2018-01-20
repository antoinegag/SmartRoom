# **Sensors**

## getSensorData

  Returns a read of all sensors as a json object

* **URL**

  /smartroom/api/sensors/getSensorData

* **Method:**

  `GET`
  
*  **URL Params** 

   None

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
    ```json
    {
        "temperature": 20,
        "analogTemperature": 18.07, 
        "lightLevel": 349,
        "humidity": 18
    }
    ```
----
# **Lights**

## getPoweredState

  Returns current state of the lights

* **URL**

  /smartroom/api/lights/getPoweredState

* **Method:**

  `GET`
  
*  **URL Params** 

   None

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ "state" : true|false }`

----
## Send

  Sends a command to the light

* **URL**

 /smartroom/api/lights/send/:action

* **Method:**

  `GET`
  
*  **URL Params**

   **Required:**
 
   `action`

|    Action     |    Effect     |
| ------------- |:-------------:| 
| onoff     | Send the on/off command | 
| bplus     | Increase brightness     | 
| bminus | Decrease brightness       | 
| cc| Chance Color      | 
| white| Set lights to white      | 
| space| Set lights to space-like animated blue    | 
| hell| Set lights to hell-like animated red     | 


* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{"message" : "success" }`
 
* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{"message" : "error" }`

----
# **Historical data**
## light | temperature

  Returns an array with all historical data from the lights | temperature

* **URL**

  /smartroom/api/historic/light|temperature

* **Method:**

  `GET`
  
*  **URL Params** 

   None

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br/>
    **Content:** 
    ```json
    [
      {
      "date": "2018-01-19 19:00:00",
      "value": "342"
      },
      {
      "date": "2018-01-19 19:30:00",
      "value": "342"
      },
      {
      "date": "2018-01-19 20:00:00",
      "value": "217"
      }
    ]
    ```