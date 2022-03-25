const pool = require('../configs/pool')
const Database = require('./Database')

class RSUser {
    findByCredential(credential, callback) {
        const database = new Database(pool)
        const sql = 'SELECT db_fasyankes.api_rsonline_user.kode_rs, db_fasyankes.api_rsonline_user.password '+
        'FROM db_fasyankes.api_rsonline_user WHERE db_fasyankes.api_rsonline_user.kode_rs = ?'
        const filterValue = [
            credential.kode_rs
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

module.exports = RSUser