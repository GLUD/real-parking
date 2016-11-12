'use strict'

const express = require('express')
const http = require('http')
const SocketServer = require('./app/SocketServer.js')
const routes = require('./app/routes')

const app = express()

var httpProxy = require('http-proxy')
var apiProxy = httpProxy.createProxyServer()

var geoServer = 'http://localhost:8080'
app.all("/geoserver/*", function(req, res) {
  apiProxy.web(req, res, {target: geoServer})
})

app.use(express.static('static'))

app.get('/', function(req, res) {
  res.sendFile('static/index.js')
})

for (let route of routes)
  app[route.method](route.path, route.callback)

const httpServer = http.createServer(app)
httpServer.listen(8085, () => {
  console.log('Server running on http://localhost:8085')
})

const socketServer = SocketServer(httpServer);
