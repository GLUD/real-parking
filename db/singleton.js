'use strict'

const DB = require('./index.js')

const db = new DB()
db.connect()

module.exports = db
