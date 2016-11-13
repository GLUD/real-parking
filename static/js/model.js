'use strict';

const HOST = 'http://localhost:8085'

let model = {}

model.obtenerRegistro = function(id) {
  return fetch(HOST + '/registro/' + id)
    .then(data => data.json())
}

model.actualizarRegistro = function(id) {
  console.log(id)
  return fetch(HOST + '/registro/actualizar/', {
    method: 'POST',
    headers: new Headers({
    	'Content-Type': 'application/json',
    }),
    body: JSON.stringify({
      id: id,
      horaSalida: Date.now()
    })
  })
  .then(res => res.json())
}