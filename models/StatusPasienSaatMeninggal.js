const pool = require('../configs/pool')
const Database = require('./Database')

class StatusPasienSaatMeninggal {
    getAll(user, callback) {
        const database = new Database(pool)
        const sql = 'SELECT ' +
        'covid.sebab_kematian.id, '+ 
        'covid.sebab_kematian.deskripsi ' +
        'FROM covid.sebab_kematian ' +
        'ORDER BY covid.sebab_kematian.id'

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

module.exports = StatusPasienSaatMeninggal