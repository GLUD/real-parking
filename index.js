'use strict'

const express = require('express')
const http = require('http')
const SocketServer = require('./app/SocketServer.js')
const routes = require('./app/routes')

const app = express()

app.use(express.static('public'))

for (let route of routes)
  app[route.method](route.path, route.callback);

const httpServer = http.createServer(app)
httpServer.listen(8085, () => {
  console.log('Server running on http://localhost:8085')
})

const socketServer = SocketServer(httpServer);
