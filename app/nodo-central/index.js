'use strict'

const eventEmitter = require('../lib/EventEmitter')
const db = require('../../db/singleton')

module.exports = {
    path: '/toggle',
    method: 'get',
    callback: function(req, res) {
      db.insertRegistry({ id: req.query.id })
      .then(key => {
        eventEmitter.emit('parking-change', {id: req.query.id, id_db: key})
      }).catch(err => {
        console.log(err)
      })
      res.end()
    }
}
