const pool = require('../configs/pool')
const Database = require('./Database')

class StatusVaksin {
    getAll(user, callback) {
        const database = new Database(pool)
        const sql = 'SELECT ' +
        'covid.m_vaksinasi.tahap_vaksin as id, '+ 
        'covid.m_vaksinasi.keterangan as nama ' +
        'FROM covid.m_vaksinasi ' +
        'ORDER BY covid.m_vaksinasi.tahap_vaksin'

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

module.exports = StatusVaksin