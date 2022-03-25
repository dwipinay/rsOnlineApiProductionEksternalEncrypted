const pool = require('../configs/pool')
const Database = require('./Database')

class KelompokGejala {
    getAll(user, callback) {
        const database = new Database(pool)
        const sql = 'SELECT ' +
        'covid.m_gejala_covid.id_gejala as id, '+ 
        'covid.m_gejala_covid.deskripsi_gejala as nama ' +
        'FROM covid.m_gejala_covid ' +
        'ORDER BY covid.m_gejala_covid.id_gejala'

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

module.exports = KelompokGejala