const pool = require('../configs/pool')
const Database = require('./Database')

class PenyebabKematianLangsung {
    getAll(user, callback) {
        const database = new Database(pool)
        const sql = 'SELECT ' +
        'covid.penyebab_kematian_langsung.id, '+ 
        'reference.icd_10.description ' +
        'FROM covid.penyebab_kematian_langsung INNER JOIN reference.icd_10 ' +
        'ON reference.icd_10.code = penyebab_kematian_langsung.icd_10_code'

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

    findById(id, callback) {
        const database = new Database(pool)
        const sql = 'SELECT ' +
        'covid.penyebab_kematian_langsung.id '+
        'FROM covid.penyebab_kematian_langsung ' +
        'WHERE covid.penyebab_kematian_langsung.id = ?'
        const filterValue = [
            id
        ]
        database.query(sql, filterValue).then(
            (results) => {
                callback(null, results)
            },(error) => {
                throw error
            }
        ).catch((error) => {
                callback(error, null)
            }
        )
    }
}

module.exports = PenyebabKematianLangsung