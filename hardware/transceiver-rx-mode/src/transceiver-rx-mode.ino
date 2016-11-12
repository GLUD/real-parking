/*  ----------------------------------------------------------------
    http://www.prometec.net/nrf2401
    Prog_79_1_Receptor

    Programa para recibir numeros mediante radios NRF2401
--------------------------------------------------------------------
*/

#include <nRF24L01.h>
#include <RF24.h>
#include <RF24_config.h>
#include <SPI.h>

int msg[1];

RF24 radio(9,10);
const uint64_t pipe = 0xE8E8F0F0E1LL;

void setup(void){
  Serial.begin(9600);
  radio.begin();
  radio.openReadingPipe(1,pipe);
  radio.startListening();
}

void loop(void){
  if (radio.available())
  {
    // bool done = false;
    int done = radio.read(msg, 1);
    // lastmsg = msg[0];
    Serial.println(msg[0]);
  }
}
