const pool = require('../configs/pool')
const Database = require('./Database')

class Pekerjaan {
    getAll(user, callback) {
        const database = new Database(pool)
        const sql = 'SELECT ' +
        'covid.profesi.id_profesi as id, '+ 
        'covid.profesi.deskripsi as nama ' +
        'FROM covid.profesi ' +
        'ORDER BY covid.profesi.id_profesi'

        database.query(sql)
        .then(
            (res) => {
                callback(null, res)
            },(error) => {
                throw error
            }
        )
        .catch((error) => {
                callback(error, null)
            }
        )
    }
}

module.exports = Pekerjaan