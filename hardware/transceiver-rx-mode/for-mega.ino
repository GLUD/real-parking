/*  ----------------------------------------------------------------
    http://www.prometec.net/duplex-nrf2401
    Conexion
    http://www.prometec.net/nrf2401/
    Prog_79B_Emisor

    Usando un NRF2401 para comunicar dos Arduinos en modo Duplex
    Programa Receptor:
--------------------------------------------------------------------
*/
#include <SPI.h>
#include "nRF24L01.h"
#include "RF24.h"

//====# define !important? #====
//#define CE_pin 7
//#define CSN_pin 8
//END

RF24 radio(9,53);
const uint64_t pipes[2] = { 0xF0F0F0F0E1LL, 0xF0F0F0F0D2LL };

void setup(void)
{
    pinMode(53, OUTPUT);
    Serial.begin(9600);

    radio.begin();
    radio.setRetries(15,15);
    //radio.setPayloadSize(8);
    radio.startListening();
    radio.openWritingPipe(pipes[1]);
    radio.openReadingPipe(1,pipes[0]);
}

void loop(void)
{
    if ( radio.available() )  // Si hay datos disponibles
    {
        unsigned long got_time;
        bool done = false;
        while (!done)        // Espera aqui hasta recibir algo
           {

              done = radio.read( &got_time, sizeof(unsigned long) );
              Serial.print("Dato Recibido =");
              Serial.println(got_time);
              delay(20);	// Para dar tiempo al emisor
           }

      radio.stopListening();	// Dejamos d escuchar para poder hablar

      radio.write( &got_time, sizeof(unsigned long) );
      Serial.println("Enviando Respuesta");
      radio.startListening();    // Volvemos a la escucha para recibir mas paquetes
    }
}
