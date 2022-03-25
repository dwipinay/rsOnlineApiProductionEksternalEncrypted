const pool = require('../configs/pool')
const Database = require('./Database')

class KabKota {
    getAll(user, callback) {
        const database = new Database(pool)
        const sql = 'SELECT ' +
        'reference.kab_kota.id, '+ 
        'reference.kab_kota.nama, ' +
        'reference.kab_kota.provinsi_id ' +
        'FROM reference.kab_kota ' +
        'ORDER BY reference.kab_kota.id'

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

module.exports = KabKota