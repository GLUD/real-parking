// http://www.prometec.net/el-modo-sleep-en-arduino/
// https://github.com/rocketscream/Low-Power
#include "LowPower.h"
int LED = 13;

void setup() { pinMode(13, OUTPUT); }
void loop() {
  // SLEEP_15MS
  // SLEEP_30MS
  // SLEEP_60MS
  // SLEEP_120MS
  // SLEEP_250MS
  // SLEEP_500MS
  // SLEEP_1S
  // SLEEP_2S
  // SLEEP_4S
  // SLEEP_8S
  // SLEEP_FOREVER

  LowPower.powerDown(SLEEP_8S, ADC_OFF, BOD_OFF);
  // for(int i = 0 ;  i  <  16 ; i++){
  //   //de 4 x 15 segundos = 60
  //   LowPower.powerDown(SLEEP_4S, ADC_OFF, BOD_OFF);
  // }
  digitalWrite(LED, HIGH);
  delay(5000);
  digitalWrite(LED, LOW);
  delay(5000);
  digitalWrite(LED, HIGH);
}
