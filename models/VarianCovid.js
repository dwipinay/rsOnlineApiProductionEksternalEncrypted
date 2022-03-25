const pool = require('../configs/pool')
const Database = require('./Database')

class VarianCovid {
    getAll(user, callback) {
        const database = new Database(pool)
        const sql = 'SELECT ' +
        'covid.m_varian_covid.id as id, '+ 
        'covid.m_varian_covid.jenis_varian as nama ' +
        'FROM covid.m_varian_covid ' +
        'ORDER BY covid.m_varian_covid.id'

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

module.exports = VarianCovid