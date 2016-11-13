/*
http://www.prometec.net/nrf2401/
 */
/**
 * Dependencias módulo de Ethernet
 */
#include <Ethernet.h>
#include <SPI.h>
/*Fin*/

/**
 * Dependencias módulo RF
 */
#include "RF24.h"
#include "nRF24L01.h"
#include <SPI.h>
/*Fin*/

/**
 * Variables módulo de Ethernet
 */
// Enter a MAC address for your controller below.
// Newer Ethernet shields have a MAC address printed on a sticker on the shield
byte mac[] = {0xDE, 0xBD, 0xBE, 0xEF, 0xFE, 0xED};
// if you don't want to use DNS (and reduce your sketch size)
// use the numeric IP instead of the name for the server:
IPAddress server(10, 154, 101, 74); // numeric IP for Google (no DNS)
// char server[] = "192.168.1.238";    // name address for Google (using DNS)
// IP Servicio Web Destino de Datos

// Set the static IP address to use if the DHCP fails to assign
IPAddress ip(10, 200, 101, 101); // IP Arduino

// Initialize the Ethernet client library
// with the IP address and port of the server
// that you want to connect to (port 80 is default for HTTP):
EthernetClient client;
/*Fin*/

/**
 * Variables Módulo RF
 */
RF24 radio(9, 10);
const uint64_t pipes[2] = {0xF0F0F0F0E1LL, 0xF0F0F0F0D2LL};
/*Fin*/

void setup() {
  configSerial();
  configEthernet();
  sendDataEthernet();
  configRF();
}

void configSerial() {
  // Open serial communications and wait for port to open:
  Serial.begin(9600);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for Leonardo only
  }
}

void configEthernet() {
  // start the Ethernet connection:
  Serial.println("Try to config Ethernet using DHCP");
  if (Ethernet.begin(mac) == 0) {
    Serial.println("Failed to configure Ethernet using DHCP");
    // no point in carrying on, so do nothing forevermore:
    // try to congifure using IP address instead of DHCP:
    Ethernet.begin(mac, ip);
  }
  // give the Ethernet shield a second to initialize:
  delay(100);
  Serial.println("Connecting...");
}

void configRF() {
  pinMode(10, OUTPUT);
  radio.begin();
  radio.setRetries(15, 15);
  // radio.setPayloadSize(8);
  radio.startListening();
  radio.openWritingPipe(pipes[1]);
  radio.openReadingPipe(1, pipes[0]);
}

void sendDataEthernet() {
  // if you get a connection, report back via serial:
  if (client.connect(server, 9000)) {
    Serial.println("Connected");
    // Make a HTTP request:
    client.println("GET "
                   "/soberania-code/add_sensor.php/"
                   "?temp=100&humr=80&hums=20&radi=21 HTTP/1.1");
    client.println("Host: 10.154.101.74");
    client.println("Connection: close");
    client.println();
  } else {
    // kf you didn't get a connection to the server:
    Serial.println("Connection failed");
  }
}

void loop() { interactEthernet(); }

void interactEthernet() {
  // if there are incoming bytes available
  // from the server, read them and print them:
  if (client.available()) {
    char c = client.read();
    Serial.print(c);
  }

  // if the server's disconnected, stop the client:
  if (!client.connected()) {
    Serial.println();
    Serial.println("Disconnecting...");
    client.stop();
    sendDataEthernet();
    delay(5000);
    // do nothing forevermore:
    // while(true);
  }
}

void interactRF() {
  if (radio.available()) { // Si hay datos disponibles
    unsigned long got_time;
    bool done = false;
    while (!done) {
      // Espera aqui hasta recibir algo

      done = radio.read(&got_time, sizeof(unsigned long));
      Serial.print("Dato Recibido =");
      Serial.println(got_time);
      delay(20); // Para dar tiempo al emisor
    }

    radio.stopListening(); // Dejamos d escuchar para poder hablar

    radio.write(&got_time, sizeof(unsigned long));
    Serial.println("Enviando Respuesta");
    radio.startListening(); // Volvemos a la escucha para recibir mas paquetes
  }
}
