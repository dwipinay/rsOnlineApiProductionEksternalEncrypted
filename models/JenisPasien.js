const pool = require('../configs/pool')
const Database = require('./Database')

class JenisPasien {
    getAll(user, callback) {
        const database = new Database(pool)
        const sql = 'SELECT ' +
        'covid.jenis_pasien.id_jenis_pasien as id, '+ 
        'covid.jenis_pasien.deskripsi as nama ' +
        'FROM covid.jenis_pasien ' +
        'ORDER BY covid.jenis_pasien.id_jenis_pasien'

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

module.exports = JenisPasien