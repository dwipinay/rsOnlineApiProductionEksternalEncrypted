const pool = require('../configs/pool')
const Database = require('./Database')

class Provinsi {
    getAll(user, callback) {
        const database = new Database(pool)
        const sql = 'SELECT ' +
        'reference.provinsi.id, '+ 
        'reference.provinsi.nama ' +
        'FROM reference.provinsi ' +
        'ORDER BY reference.provinsi.id'

        database.query(sql)
        .then(
            (res) => {
                let arrData = []
                res.forEach(element => {
                    arrData.push({
                        id: parseInt(element['id']),
                        nama: element['nama']
                    })
                });
                callback(null, arrData)
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

module.exports = Provinsi