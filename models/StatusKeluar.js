const pool = require('../configs/pool')
const Database = require('./Database')

class StatusKeluar {
    getAll(user, callback) {
        const database = new Database(pool)
        const sql = 'SELECT ' +
        'covid.dischargestatus_v3.id_status as id, '+ 
        'covid.dischargestatus_v3.status as nama ' +
        'FROM covid.dischargestatus_v3 ' +
        'WHERE covid.dischargestatus_v3.id_status != 0 ' +
        'ORDER BY covid.dischargestatus_v3.id_status'

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