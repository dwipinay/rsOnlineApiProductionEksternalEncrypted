const pool = require('../configs/pool')
const Database = require('./Database')

class Kecamatan {
    getAll(user, callback) {
        const database = new Database(pool)
        const sql = 'SELECT ' +
        'reference.kecamatan.id, '+ 
        'reference.kecamatan.nama, ' +
        'reference.kecamatan.kab_kota_id '+
        'FROM reference.kecamatan ' +
        'ORDER BY reference.kecamatan.id'

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

module.exports = Kecamatan