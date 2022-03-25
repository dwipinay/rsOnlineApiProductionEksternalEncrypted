const pool = require('../configs/pool')
const Database = require('./Database')

class JenisVaksin {
    getAll(user, callback) {
        const database = new Database(pool)
        const sql = 'SELECT ' +
        'covid.m_jenis_vaksin.id_jenis_vaksin as id, '+ 
        'covid.m_jenis_vaksin.nama_vaksin as nama ' +
        'FROM covid.m_jenis_vaksin ' +
        'ORDER BY covid.m_jenis_vaksin.id_jenis_vaksin'

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

module.exports = JenisVaksin