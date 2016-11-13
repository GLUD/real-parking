'use strict'

const eventEmitter = require('../lib/EventEmitter')

module.exports = {
    path: '/toggle',
    method: 'get',
    callback: function(req, res) {
      eventEmitter.emit('parking-change', {id: req.query.id, id_db: 'aaaa'})
      //TODO: Save event in the data base
      //TODO: Send event with id db
      res.end()
    }
}
