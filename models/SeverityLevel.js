const pool = require('../configs/pool')
const Database = require('./Database')

class SeverityLevel {
    getAll(user, callback) {
        const database = new Database(pool)
        const sql = 'SELECT ' +
        'covid.m_severity_level.level as id, '+ 
        'covid.m_severity_level.keterangan as nama ' +
        'FROM covid.m_severity_level ' +
        'ORDER BY covid.m_severity_level.level'

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

module.exports = SeverityLevel