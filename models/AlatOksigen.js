const pool = require('../configs/pool')
const Database = require('./Database')

class AlatOksigen {
    getAll(user, callback) {
        const database = new Database(pool)
        const sql = 'SELECT ' +
        'covid.m_alatoksigen.id_alat as id, '+ 
        'covid.m_alatoksigen.nama_alat as nama ' +
        'FROM covid.m_alatoksigen ' +
        'ORDER BY covid.m_alatoksigen.id_alat'

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

module.exports = AlatOksigen