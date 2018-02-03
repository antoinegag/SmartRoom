/* SETUP ON ARDUINO UNO
 *  Temperature Sensor: pin A2
 *  Humidity + Temperature sensor: pin 5
 *  Photoresistor: pin A2 w/ 10k pullup resistor
 *  IR Led: pin 3 + 20k resistor
 */

/*
 * Everything IR related
 */
#include <IRremote.h>
#include <IRremoteInt.h>
int TRANS_PIN =  3; 
IRsend irsend;

const int freq = 38;

//These are the data for my particular led strip
const unsigned int OnOff[67] = {8900,4550, 500,600, 550,550, 550,600, 550,600, 500,600, 550,550, 550,600, 550,600, 500,1700, 550,1700, 500,1700, 500,1700, 550,1700, 500,1700, 550,1700, 500,1700, 550,1700, 500,600, 550,1700, 500,600, 500,600, 550,600, 500,1700, 550,600, 500,600, 500,1750, 500,600, 550,1700, 500,1700, 550,1700, 500,600, 500,1700, 550};
const unsigned int  White[67] = {9000,4500, 550,550, 550,600, 550,550, 550,600, 550,550, 550,600, 550,550, 550,600, 550,1700, 500,1700, 550,1700, 500,1700, 550,1700, 500,1700, 550,1700, 500,1700, 550,550, 550,1700, 550,1700, 500,600, 550,550, 550,600, 550,1700, 500,600, 550,1700, 500,550, 550,600, 550,1700, 500,1700, 550,1700, 500,600, 550,1700, 500};  // NEC FF629D
const unsigned int  BrightPlus[67] = {9000,4500, 600,550, 550,600, 500,600, 550,600, 500,600, 550,600, 500,600, 550,600, 500,1700, 550,1700, 500,1700, 550,1700, 500,1700, 550,1700, 500,1700, 550,1700, 500,1700, 550,1700, 500,1700, 550,600, 500,600, 550,600, 550,600, 500,600, 550,600, 500,600, 550,600, 500,1700, 550,1700, 500,1700, 550,1700, 550,1650, 550};  // NEC FFE01F
const unsigned int colorChange[67] = {8950,4500, 550,600, 500,600, 550,600, 500,600, 550,600, 500,600, 550,600, 500,600, 550,1700, 500,1700, 500,1700, 550,1700, 500,1700, 550,1700, 500,1700, 500,1700, 550,1700, 500,600, 550,600, 500,1700, 550,600, 500,600, 550,600, 500,600, 550,600, 500,1700, 500,1700, 550,600, 500,1700, 550,1700, 500,1700, 500,1700, 550};  // NEC FF906F
const unsigned int  B_MINUS[67] = {8950,4500, 550,600, 500,600, 550,550, 550,600, 550,550, 550,600, 550,550, 550,600, 550,1700, 500,1700, 500,1700, 550,1700, 500,1700, 550,1700, 500,1700, 550,1700, 500,1700, 500,1700, 550,550, 550,600, 550,550, 550,600, 550,1700, 500,600, 550,550, 550,600, 550,1700, 500,1700, 550,1700, 500,1700, 500,600, 550,1700, 500};  // NEC FFC23D
const unsigned int  hell[67] ={8950,4250,750,350,750,350,700,400,750,350,750,350,700,400,700,400,700,450,600,1600,600,1600,600,1650,550,1650,600,1600,600,1650,500,1700,550,1650,550,550,550,550,550,550,550,1700,500,600,500,550,550,600,500,600,500,1700,500,1700,550,1650,550,550,550,1700,500,1700,500,1700,550,1650,550};
const unsigned int  end_d[67] = {8950,4500, 550,600, 500,600, 550,600, 500,600, 550,600, 500,600, 550,600, 500,600, 550,1650, 550,1700, 500,1700, 550,1700, 500,1700, 500,1700, 550,1700, 500,1700, 550,1700, 500,600, 550,1700, 500,1700, 500,600, 550,600, 500,600, 550,600, 500,600, 550,1700, 500,600, 550,600, 500,1700, 500,1700, 550,1700, 500,1700, 550};  // NEC FFB04F
void sendNether(){irsend.sendRaw(hell, sizeof(OnOff),freq ); }

void sendEnd(){irsend.sendRaw(end_d, sizeof(OnOff),freq );}

void sendOnOff(){irsend.sendRaw(OnOff, sizeof(OnOff),freq );}

void sendBrightPlus(){irsend.sendRaw(BrightPlus, sizeof(BrightPlus),freq);}

void sendBrightMinus(){irsend.sendRaw(B_MINUS, sizeof(B_MINUS),freq);}

void sendWhite(){irsend.sendRaw(White, sizeof(White),freq);}

void sendColorChange(){irsend.sendRaw(colorChange, sizeof(colorChange),freq);}

void openLights() {
  sendOnOff();
  delay(500);
  sendWhite();
  delay(500);
  for(int i = 0; i < 3; i++){
    sendBrightPlus();
    delay(1000);
  }
}

/*
 * Humidity + temp sensor
 */
#include<dht.h>
dht DHT;
#define DHT11_PIN 5

/*
 * Temp sensor
 */
int val;
int tempPin = A1;

/*
 * OnBoard "L" LED
 */
int led = 13;

/*
 * Photoresistor
 */
const int pResistor = A2;
int lum_value;

void setup() {
  Serial.begin(9600);
 
  pinMode(pResistor, INPUT); //Photoresistor
  pinMode(led,OUTPUT);  //Onboard led

  pinMode(TRANS_PIN, OUTPUT); //IR Led
  
  Serial.print("READY");
}

/*
 * Return the value from `tempPin` converted to degree C
 */
float getAnalogTemp() {

  //For some reason have to read twice to get an accurate reading
  val = analogRead(tempPin);
  return ((analogRead(tempPin)/1024.0)*5000) / 10;
}

/*
 * Return the current humidity level in %
 */
float getHumidity() {
  DHT.read11(DHT11_PIN);
  DHT.read11(DHT11_PIN);
  return DHT.humidity;
}

/*
 * Returns a level from 0 to 1000
 */
int getLightLevel() {
  lum_value = analogRead(pResistor);
  return analogRead(pResistor);;
}

/*
 * Returns unexact temperature reading
 */
float getTemp() {
  DHT.read11(DHT11_PIN);
  return DHT.temperature;
}

/*
 * Sends all the sensor reading to serial
 * Formatted into a json array
 */
void sendData() {
  digitalWrite(led,HIGH);
  Serial.print("[" + String(getTemp()) + ""","  + String(getAnalogTemp()) + ""","+ String(getLightLevel()) + ""","+ String(getHumidity()) + """]");
  digitalWrite(led,LOW);
}

void loop()
{
  
}


/*
 * On serial event reads the first character 
 * and then empty the input buffer
 */
void serialEvent() {
  while (Serial.available()) {
    // get the new byte:
    char inChar = (char)Serial.read();
    if(inChar == 'P') 
      sendBrightPlus();
    else if (inChar == 'M')
      sendBrightMinus();
    else if (inChar == 'O')
      sendOnOff();
    else if (inChar == 'C')
      sendColorChange();     
    else if (inChar == 'W')
      sendWhite();  
    else if(inChar == 'E')
      sendEnd();
    else if(inChar == 'N')
      sendNether(); 
    else if(inChar == 'G') 
      sendData();

    //Empty the input buffer
    while (Serial.available()) {
      char t = Serial.read();
    }
  }
}

