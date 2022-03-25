const pool = require('../configs/pool')
const Database = require('./Database')

class LokasiKematian {
    getAll(user, callback) {
        const database = new Database(pool)
        const sql = 'SELECT ' +
        'covid.lokasi_kematian.id, '+ 
        'covid.lokasi_kematian.nama ' +
        'FROM covid.lokasi_kematian ' +
        'ORDER BY covid.lokasi_kematian.id'

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

module.exports = LokasiKematian