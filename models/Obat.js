const pool = require('../configs/pool')
const Database = require('./Database')

class Obat {
    getAll(user, callback) {
        const database = new Database(pool)
        const sql = 'SELECT ' +
        'covid.m_kebutuhan.id_kebutuhan as id, '+ 
        'covid.m_kebutuhan.kebutuhan as nama ' +
        'FROM covid.m_kebutuhan ' +
        'WHERE covid.m_kebutuhan.kategori = 2 ' +
        'ORDER BY covid.m_kebutuhan.id_kebutuhan'

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

module.exports = Obat