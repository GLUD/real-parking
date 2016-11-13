'use strict'

module.exports = {
  consultar: {
    path: '/registro/:id',
    method: 'get',
    callback: function(req, res) {
      res.send({
        'id_db': req.params.id,
        'horaIngreso': Date.now()
      })
    }
  },
  actualizar: {
    path: '/registro/actualizar/',
    method: 'post',
    callback: function(req, res) {
      // console.log(req.body)
      res.send({
        id: req.body.id,
        horaSalida: req.body.horaSalida
      })
    }
  }
}
