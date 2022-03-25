const pool = require('../configs/pool')
const Database = require('./Database')

class StatusRawat {
    getAll(user, callback) {
        const database = new Database(pool)
        const sql = 'SELECT ' +
        'db_fasyankes.m_tempat_tidur.id_tt as id, '+ 
        'db_fasyankes.m_tempat_tidur.tt as nama ' +
        'FROM db_fasyankes.m_tempat_tidur ' +
        'WHERE db_fasyankes.m_tempat_tidur.id_tt in (24,25,26,27,28,29,30,31,32,33) '
        'ORDER BY db_fasyankes.m_tempat_tidur.id_tt'

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

module.exports = StatusRawat