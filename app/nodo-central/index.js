'use strict'

const eventEmitter = require('../lib/EventEmitter')

module.exports = {
    path: '/toggle',
    method: 'get',
    callback: function(req, res) {
      eventEmitter.emit('parking-change', req.query.id)
      //TODO Save event in the data base
      res.end()
    }
}
