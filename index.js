'use strict'

const express = require('express')
const http = require('http')
const SocketServer = require('./app/SocketServer.js')

const app = express()

app.use(express.static('public'))

//Move Router
app.get('/', (req, res) => {
  res.send('Hello')
})

const httpServer = http.createServer(app)
httpServer.listen(8085, () => {
  console.log('Server running on http://localhost:8085')
})

const socketServer = SocketServer(httpServer);
