const pool = require('../configs/pool')
const Database = require('./Database')

class Pelayanan {
    getAll(user, callback) {
        const database = new Database(pool)
        const sql = 'SELECT ' +
        'db_fasyankes.m_pelayanan.kode_pelayanan as id, '+ 
        'db_fasyankes.m_pelayanan.pelayanan as nama ' +
        'FROM db_fasyankes.m_pelayanan ' +
        'ORDER BY db_fasyankes.m_pelayanan.kode_pelayanan'

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

module.exports = Pelayanan