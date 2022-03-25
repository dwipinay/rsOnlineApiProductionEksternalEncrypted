const pool = require('../configs/pool')
const Database = require('./Database')

class KomorbidCoInsiden {
    getAll(user, callback) {
        const database = new Database(pool)
        const sql = 'SELECT ' +
        'covid.komorbid_coinsiden.id, ' +
        'covid.komorbid_coinsiden.jenis as nama ' +
        'FROM covid.komorbid_coinsiden ' +
        'ORDER BY covid.komorbid_coinsiden.id'

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

module.exports = KomorbidCoInsiden