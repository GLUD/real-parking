/*  ----------------------------------------------------------------
    http://www.prometec.net/duplex-nrf2401
    Prog_79B_Emisor

    Usando un NRF2401 para comunicar dos Arduinos en modo Duplex
    Programa Emisor:
   --------------------------------------------------------------------
 */
#include "RF24.h"
#include "nRF24L01.h"
#include <SPI.h>

RF24 radio(9, 10);

const uint64_t pipes[2] = {0xF0F0F0F0E1LL,
                           0xF0F0F0F0D2LL}; // LongLong = 64 bits.

void setup(void) {
  pinMode(10, OUTPUT);
  Serial.begin(9600);
  radio.begin();

  radio.setRetries(15, 15); // Maximos reintentos
  // radio.setPayloadSize(8);   // Reduce el payload de 32 si tienes problemas

  // Open pipes to other nodes for communication
  radio.openWritingPipe(pipes[0]);
  radio.openReadingPipe(1, pipes[1]);
}

void loop(void) {
  radio.stopListening(); // Paramos la escucha para poder hablar
  char idIsla = 1;
  char estado = 0;
  char msg[2]= {idIsla, estado};
  //unsigned long time = millis();
  Serial.print("Enviando  ");
  Serial.print((int)msg[0]);
  Serial.println((int)msg[1]);
  //bool ok = radio.write(&time, sizeof(unsigned long));
  bool ok = radio.write(msg, 2);

  if (ok){
    Serial.println("ok...");
  } else {
    Serial.println("failed");
  }

  radio.startListening(); // Volvemos a la escucha

  unsigned long started_waiting_at = millis();
  bool timeout = false;
  while (!radio.available() && !timeout){ // Esperasmos repsuesta hasta 200ms
    if (millis() - started_waiting_at > 500){
      timeout = true;
    }
  }

  if (timeout){
    Serial.println("Failed, response timed out");
  } else { // Leemos el mensaje recibido
    char got_isla[2];
    radio.read(&got_isla, 2);

    Serial.print("Respuesta = ");
    Serial.print((int)got_isla[0]);
    Serial.println((int)got_isla[1]);
  }
  delay(5000);
}
