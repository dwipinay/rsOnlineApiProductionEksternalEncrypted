const pool = require('../configs/pool')
const Database = require('./Database')

class User {
    insertData(credential, callback) {
        const database = new Database(pool)
        const sql = 'INSERT INTO db_fasyankes.api_users ( `name`, `email`, `password`, `app_name`, `created_at` ) ' +
            'VALUES ( ?, ?, ?, ?, now() )'
        const payload = [
            credential.name,
            credential.email,
            credential.password,
            credential.app_name
        ]
        database.query(sql, payload).then(
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

    findByCredential(credential, callback) {
        const database = new Database(pool)
        const sql = 'SELECT db_fasyankes.api_users.email, ' +
        'db_fasyankes.api_users.password ' +
        'FROM db_fasyankes.api_users WHERE db_fasyankes.api_users.email = ?'
        const filterValue = [
            credential.email
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

module.exports = User