/*

 ESP8266 library
 
 
 
 When you use with UNO board, uncomment the follow line in uartWIFI.h.
 
 #define UNO
 
 
 
 When you use with MEGA board, uncomment the follow line in uartWIFI.h.
 
 #define MEGA
 
 
 
 Connection:
 
 When you use it with UNO board, the connection should be like these:
 
 ESP8266_TX->(your softserial receive pin)
 
 ESP8266_RX->1K resistor->(your softserial transmit pin)
 
 ESP8266_CH_PD->3.3V
 
 ESP8266_VCC->3.3V
 
 ESP8266_GND->GND
 
 
 
 FTDI_RX->D3			//The baud rate of software serial can't be higher that 19200, so we use software serial as a debug port
 
 FTDI_TX->D2
 
 
 
 When you use it with MEGA board, the connection should be like these:
 
 ESP8266_TX->RX1(D19)
 
 ESP8266_RX->TX1(D18)
 
 ESP8266_CH_PD->3.3V
 
 ESP8266_VCC->3.3V
 
 ESP8266_GND->GND
 
 
 
 When you want to output the debug information, please use DebugSerial. For example,
 
 
 
 DebugSerial.println("hello");
 
 
 
 
 
 Note:	The size of message from ESP8266 is too big for arduino sometimes, so the library can't receive the whole buffer because  
 
 the size of the hardware serial buffer which is defined in HardwareSerial.h is too small.
 
 
 
 Open the file from \arduino\hardware\arduino\avr\cores\arduino\HardwareSerial.h.
 
 See the follow line in the HardwareSerial.h file.
 
 
 
 #define SERIAL_BUFFER_SIZE 64
 
 
 
 The default size of the buffer is 64. Change it into a bigger number, like 256 or more.
 
 
 
 
 
 
 
 
 
 
 
 */


#define SSID       "yourssid"
#define PASSWORD   "yourpassword"




#include "uartWIFIUNO.h"

#include <SoftwareSerial.h>

WIFIUNO wifi;



extern int chlID;	//client id(0-4)

int sprinkler = 5;
int LED2 = 6;

extern int chlID;



void setup()

{

  pinMode(sprinkler,OUTPUT);     
  digitalWrite(sprinkler,HIGH);  //pullup to turn off.


  pinMode(LED2,OUTPUT);
  digitalWrite(LED2,LOW);  



  wifi.begin();

  bool b = wifi.Initialize(STA, SSID, PASSWORD);

  if(!b)

  {

    DebugSerial.println("Init error");

  }

  delay(8000);  //make sure the module can have enough time to get an IP address 

  String ipstring  = wifi.showIP();

  DebugSerial.println(ipstring);		//show the ip address of module



  delay(2000);

  wifi.confMux(1);

  delay(100);

  if(wifi.confServer(1,8080))

    DebugSerial.println("Server is set up");





}

void loop()

{



  char buf[100];

  int iLen = wifi.ReceiveMessage(buf);

  if(iLen > 0)

  {

    DebugSerial.println(buf);	

    if (strstr(buf, "HELLO") != NULL)

    {

      digitalWrite(sprinkler,LOW);  

      DebugSerial.println("GOT HELLO");
      if(wifi.Send(chlID,"HELLO from Arduino!\r\n"))
        DebugSerial.println("Message sent okay.");
      

    }


    if (strstr(buf, "CH0ON") != NULL)

    {

      digitalWrite(sprinkler,LOW);  

      DebugSerial.println("CH0ON");
      wifi.Send(chlID,"Sprinkler ON\r\n");


    }

    if (strstr(buf, "CH0OFF") != NULL)

    {

      digitalWrite(sprinkler,HIGH);

      DebugSerial.println("CH0OFF");
      wifi.Send(chlID,"Sprinkler OFF\r\n");


    }

    if (strstr(buf, "CH1ON") != NULL)

    {

      digitalWrite(LED2,HIGH);     

      DebugSerial.println("CH1ON");	  

    }

    if (strstr(buf, "CH1OFF") != NULL)

    {

      digitalWrite(LED2,LOW);     

      DebugSerial.println("CH1OFF");	  

    }





  }

}

