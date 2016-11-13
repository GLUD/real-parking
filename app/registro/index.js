'use strict'

const db = require('../../db/singleton')

module.exports = {
  consultar: {
    path: '/registro/:id',
    method: 'get',
    callback: function(req, res) {
      // 'id_db': req.params.id,
      db.getRegistry(req.params.id)
      .then(data => {
        res.send(data)
      })
      .catch(err => {
        res.send(err)
      })
    }
  },
  actualizar: {
    path: '/registro/actualizar/',
    method: 'post',
    callback: function(req, res) {
      db.updateRegistry(req.body.id)
      .then(data => {
        res.send(data)
      })
      .catch(err => {
        res.send(err)
      })
    }
  }
}
