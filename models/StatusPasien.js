const pool = require('../configs/pool')
const Database = require('./Database')

class StatusPasien {
    getAll(user, callback) {
        const database = new Database(pool)
        const sql = 'SELECT ' +
        'covid.status_rawat_kmk.id_status_rawat as id, '+ 
        'covid.status_rawat_kmk.status as nama ' +
        'FROM covid.status_rawat_kmk ' +
        'ORDER BY covid.status_rawat_kmk.id_status_rawat'

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

module.exports = StatusPasien