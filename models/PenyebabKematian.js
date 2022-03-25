const pool = require('../configs/pool')
const Database = require('./Database')

class PenyebabKematian {
    getAll(user, callback) {
        const database = new Database(pool)
        const sql = 'SELECT ' +
        'covid.m_penyebab.id, '+ 
        'covid.m_penyebab.penyebab as nama ' +
        'FROM covid.m_penyebab ' +
        'ORDER BY covid.m_penyebab.id'

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

module.exports = PenyebabKematian