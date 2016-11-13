'use strict'

const r = require('rethinkdb')
const config = require('./config')
const moment = require('moment')
const co = require('co')

var connection = null;

class DB {
  constructor() {
    this.connected = false
    this.connection = null
  }

  connect() {
    this.connection = r.connect(config)
    this.connected = true;

    return this.connection
  }

  getRegistry(id) {
    if(!this.connected)
      return Promise.reject('Conectese')

    let connection = this.connection

    let task = co(function* (){

      let conn = yield connection
      let result = yield r.db(config.db).table('registry').get(id).run(conn)


      return Promise.resolve(result)
    })

    return task
  }

  insertRegistry(registry) {

    if(!this.connected)
      return Promise.reject('Conectese')

    let connection = this.connection

    let task = co(function* (){

      let conn = yield connection
      let timeBegin =  moment().format('HH:mm:ss')

      let result = yield r.db(config.db).table('registry').insert({
        isle: registry.id,
        timeBegin: timeBegin,
        timeEnd: null,
        date: moment().format('DD-MM-YYYY')

      }).run(conn)

      if(result.inserted)
        return Promise.resolve(result.generated_keys[0])

    })

    return task
  }

  updateRegistry(id) {

    if(!this.connected)
      Promise.reject('Conectese')

    let timeEnd = moment().format('HH:mm:ss')
    let connection = this.connection

    let task = co(function*() {

      let conn = yield connection
      let result = yield r.db(config.db).table('registry').get(id).update({
        timeEnd: timeEnd
      }, { returnChanges: true, nonAtomic: true }).run(conn)

      if(result.replaced)
        return Promise.resolve(result.changes[0].new_val)

    })

    return task
  }
}

function getData(conn) {

    r.db('RealParking').table('register').run(conn, function (err, cursor) {
        if (err)
            throw err;
        cursor.toArray(function (err, result) {
            if (err)
                throw err;
            console.log(JSON.stringify(result, null, 2));
        });
    });

}

module.exports = DB;
