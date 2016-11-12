/*  ----------------------------------------------------------------
    http://www.prometec.net/duplex-nrf2401
    Prog_79B_Emisor

    Usando un NRF2401 para comunicar dos Arduinos en modo Duplex
    Programa Emisor:
   --------------------------------------------------------------------
 */
#include <SPI.h>
#include "nRF24L01.h"
#include "RF24.h"

RF24 radio(9,10);

const uint64_t pipes[2] = { 0xF0F0F0F0E1LL, 0xF0F0F0F0D2LL };

void setup(void)
{
  pinMode(10, OUTPUT);
  Serial.begin(9600);
  radio.begin();

  radio.setRetries(15,15); // Maximos reintentos
  //radio.setPayloadSize(8);   // Reduce el payload de 32 si tienes problemas

  // Open pipes to other nodes for communication
  radio.openWritingPipe(pipes[0]);
  radio.openReadingPipe(1,pipes[1]);
}

void loop(void)
{
  radio.stopListening(); // Paramos la escucha para poder hablar
  unsigned long time = millis();
  Serial.print("Enviando  ");
  Serial.println(time);
  bool ok = radio.write( &time, sizeof(unsigned long) );

  if (ok)
    Serial.println("ok...");
  else
    Serial.println("failed");

  radio.startListening(); //Volvemos a la escucha

  unsigned long started_waiting_at = millis();
  bool timeout = false;
  while ( !radio.available() && !timeout ) // Esperasmos repsuesta hasta 200ms
    if (millis() - started_waiting_at > 200 ) timeout = true;

  if ( timeout )
    Serial.println("Failed, response timed out");
  else
  { // Leemos el mensaje recibido
    unsigned long got_time;
    radio.read( &got_time, sizeof(unsigned long) );

    Serial.print("Respuesta = ");
    Serial.println(got_time);
  }
  delay(500);
}
