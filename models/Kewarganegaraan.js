const pool = require('../configs/pool')
const Database = require('./Database')

class Kewarganegaraan {
    getAll(user, callback) {
        const database = new Database(pool)
        const sql = 'SELECT ' +
        'covid.kode_negara.iso as id, '+ 
        'covid.kode_negara.nicename ' +
        'FROM covid.kode_negara ' +
        'ORDER BY covid.kode_negara.id'

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

module.exports = Kewarganegaraan