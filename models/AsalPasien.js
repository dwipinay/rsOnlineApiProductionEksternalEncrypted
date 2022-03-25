const pool = require('../configs/pool')
const Database = require('./Database')

class AsalPasien {
    getAll(user, callback) {
        const database = new Database(pool)
        const sql = 'SELECT ' +
        'covid.m_asalpasien.id_asalpasien as id, '+ 
        'covid.m_asalpasien.keterangan as nama ' +
        'FROM covid.m_asalpasien ' +
        'ORDER BY covid.m_asalpasien.id_asalpasien'

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

module.exports = AsalPasien