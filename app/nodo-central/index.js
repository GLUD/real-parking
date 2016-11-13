'use strict'

const eventEmitter = require('../lib/EventEmitter')
const db = require('../../db/singleton')

module.exports = {
    path: '/parking-change',
    method: 'get',
    callback: function(req, res) {
      console.log(req.query)
      db.insertRegistry({ id: req.query.id })
      .then(key => {
        eventEmitter.emit('parking-change', {
          id: req.query.id,
          id_db: key,
          state: req.query.st
        })
      }).catch(err => {
        console.log(err)
      })
      res.end()
    }
}
