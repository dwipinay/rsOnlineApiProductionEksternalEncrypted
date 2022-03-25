const pool = require('../configs/pool')
const Database = require('./Database')

class JenisPemeriksaanLab {
    getAll(user, callback) {
        const database = new Database(pool)
        const sql = 'SELECT ' +
        'covid.m_jenis_pemeriksaan.id_jenis_pemeriksaan as id, '+ 
        'covid.m_jenis_pemeriksaan.jenis_pemeriksaan as nama ' +
        'FROM covid.m_jenis_pemeriksaan ' +
        'ORDER BY covid.m_jenis_pemeriksaan.id_jenis_pemeriksaan'

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

module.exports = JenisPemeriksaanLab