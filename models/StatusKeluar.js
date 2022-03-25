const pool = require('../configs/pool')
const Database = require('./Database')

class StatusKeluar {
    getAll(user, callback) {
        const database = new Database(pool)
        const sql = 'SELECT ' +
        'covid.dischargestatus.id_status as id, '+ 
        'covid.dischargestatus.status as nama ' +
        'FROM covid.dischargestatus ' +
        'WHERE covid.dischargestatus.id_status != 0 ' +
        'ORDER BY covid.dischargestatus.id_status'

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

module.exports = StatusKeluar