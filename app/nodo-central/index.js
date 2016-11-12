'use strict'

const eventEmitter = require('../lib/EventEmitter')

module.exports = {
    path: '/toggle',
    method: 'get',
    callback: function(req, res) {
      //TODO Extract the data from the request
      eventEmitter.emit('toggle-park')
      //TODO Save event in the data base
      res.end()
    }
}
