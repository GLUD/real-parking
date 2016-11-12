#define trigPin 13
#define echoPin 12
#define led 7  // Indicador para deteccion del vehiculo

int limite = 300 ;   // Distancia max entre el suelo y el vehiculo
long duracion, distancia ;

void setup()
{
    Serial.begin (9600);
    pinMode(trigPin, OUTPUT);
    pinMode(echoPin, INPUT);
    pinMode(led, OUTPUT);
}

void loop() {
    digitalWrite(trigPin, LOW);        // Nos aseguramos de que el trigger está desactivado
    //delayMicroseconds(2);              // Para asegurarnos de que el trigger esta LOW
    digitalWrite(trigPin, HIGH);       // Activamos el pulso de salida
    //delayMicroseconds(10);             // Esperamos 10µs. El pulso sigue active este tiempo
    digitalWrite(trigPin, LOW);        // Cortamos el pulso y a esperar el echo
    duracion = pulseIn(echoPin, HIGH);
    distancia = duracion/2/29.1;
    if ( distancia < limite) {
      Serial.println(String(distancia) + " cm.") ;
      digitalWrite (led, HIGH) ;
    }
    else{
      Serial.println(String(distancia) + " cm.") ;
      digitalWrite(led, LOW) ;
    }
    //delay (500) ;                  // Para limitar el número de mediciones
}
