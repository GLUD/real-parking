'use strict';

const eventEmitter = require('./lib/EventEmitter')
const io = require('socket.io')

module.exports = function createSocketServer(server) {

  const ioServer = io(server)

  ioServer.on('connection', (client) => {
    console.log(`${client.id} has connected`)

    eventEmitter.on('parking-change', (parkingSlot) => {
      client.emit('parking-change', { id: parkingSlot })
    })

  })
}
