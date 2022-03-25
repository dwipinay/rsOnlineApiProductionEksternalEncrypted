const pool = require('../configs/pool')
const Database = require('./Database')

class Komorbid {
    getAll(user, callback) {
        const database = new Database(pool)
        const sql = 'SELECT ' +
        'covid.komorbid.`id`, ' +
        'CASE ' +
        'WHEN reference.icd_10.`description` IS NULL THEN "Lainnya" ' +
        'ELSE reference.icd_10.`description` ' +
        'END AS nama ' +
        'FROM covid.`komorbid` left outer join reference.icd_10 ' +
        'ON reference.icd_10.code = covid.komorbid.icd_10_code ' +
        'ORDER BY ' +
        'CASE  ' +
        'WHEN reference.icd_10.`description` IS NOT NULL THEN 0 else 1 ' +
        'END ASC, covid.komorbid.id'

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

module.exports = Komorbid