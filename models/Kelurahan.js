const pool = require('../configs/pool')
const Database = require('./Database')

class Kelurahan {
    getAll(user, callback) {
        const database = new Database(pool)
        const sql = 'SELECT ' +
        'reference.kelurahan.id, '+ 
        'reference.kelurahan.nama, ' +
        'reference.kelurahan.kecamatan_id '+
        'FROM reference.kelurahan ' +
        'ORDER BY reference.kelurahan.id'

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

module.exports = Kelurahan