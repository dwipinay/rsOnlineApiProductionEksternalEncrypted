const pool = require('../configs/pool')
const Database = require('./Database')

class KetersediaanPelayanan {
    getData(req, callback) {
        const database = new Database(pool)
        const sqlUserScope = 'SELECT db_api_auth.scope.id ' +
            'FROM db_api_auth.scope ' +
            'WHERE db_api_auth.scope.user_id = ? ' +
            'AND db_api_auth.scope.endpoint_id = 4'

        const sqlFilterValueUserScope = [req.user.id]

        database.query(sqlUserScope, sqlFilterValueUserScope)
        .then(
            (resUserScope) => { 
                if (resUserScope.length == 0){
                    return callback("not allowed", [])
                }

                const sqlSelect = 'SELECT db_fasyankes.m_pelayanan.kode_pelayanan as pelayananId,' +
                'db_fasyankes.m_pelayanan.pelayanan as pelayananNama ' +
                'FROM db_fasyankes.t_pelayanan INNER JOIN db_fasyankes.m_pelayanan ' +
                'ON db_fasyankes.m_pelayanan.kode_pelayanan = db_fasyankes.t_pelayanan.kode_pelayanan ' +
                'WHERE db_fasyankes.t_pelayanan.koders = ? ' +
                'ORDER BY pelayananNama'

                const sqlFilterValue = [
                    req.query.kode_rs
                ]
        
                database.query(sqlSelect, sqlFilterValue)
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
            },(error) => {
                throw error
            }
        )
        .catch((error) => {
            callback(error, null)
        })
    }
}

module.exports = KetersediaanPelayanan