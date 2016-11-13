/*
 */
#include <Ethernet.h>
#include <SPI.h>

// Enter a MAC address for your controller below.
// Newer Ethernet shields have a MAC address printed on a sticker on the shield
byte mac[] = {0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED};
// if you don't want to use DNS (and reduce your sketch size)
// use the numeric IP instead of the name for the server:
IPAddress server(10, 200, 101, 46); // numeric IP for Google (no DNS)
// char server[] = "192.168.1.238";    // name address for Google (using DNS)
// IP Servicio Web Destino de Datos

// Set the static IP address to use if the DHCP fails to assign
IPAddress ip(10, 200, 101, 101);//IP Arduino

// Initialize the Ethernet client library
// with the IP address and port of the server
// that you want to connect to (port 80 is default for HTTP):
EthernetClient client;

void setup() {
  // Open serial communications and wait for port to open:
  Serial.begin(9600);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for Leonardo only
  }

  // start the Ethernet connection:
  if (Ethernet.begin(mac) == 0) {
    Serial.println("Failed to configure Ethernet using DHCP");
    // no point in carrying on, so do nothing forevermore:
    // try to congifure using IP address instead of DHCP:
    Ethernet.begin(mac, ip);
  }
  // give the Ethernet shield a second to initialize:
  delay(100);
  Serial.println("connecting...");

  // if you get a connection, report back via serial:
  cone();
}

void cone() {
  if (client.connect(server, 9000)) {
    Serial.println("connected");
    // Make a HTTP request:
    client.println("GET "
                   "/soberania-code/add_sensor.php/"
                   "?temp=100&humr=80&hums=20&radi=21 HTTP/1.1");
    client.println("Host: 10.200.101.46");
    client.println("Connection: close");
    client.println();
  } else {
    // kf you didn't get a connection to the server:
    Serial.println("connection failed");
  }
}

void loop() {
  // if there are incoming bytes available
  // from the server, read them and print them:
  if (client.available()) {
    char c = client.read();
    Serial.print(c);
  }

  // if the server's disconnected, stop the client:
  if (!client.connected()) {
    Serial.println();
    Serial.println("disconnecting.");
    client.stop();
    cone();
    delay(5000);
    // do nothing forevermore:
    // while(true);
  }
}
