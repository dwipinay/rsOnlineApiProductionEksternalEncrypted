const pool = require('../configs/pool')
const Database = require('./Database')

class KetersediaanAlkes {
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

                const sqlSelect = 'SELECT ' +
                'db_fasyankes.ketersediaan_alkes.alkes_code, db_fasyankes.alkes.name as nama, db_fasyankes.ketersediaan_alkes.standar, ' +
                'db_fasyankes.ketersediaan_alkes.jumlah, db_fasyankes.ketersediaan_alkes.rusak, db_fasyankes.ruang_alkes.name as ruang ' +
                'FROM ' +
                'db_fasyankes.ketersediaan_alkes INNER JOIN db_fasyankes.alkes ' +
                'ON db_fasyankes.alkes.code = db_fasyankes.ketersediaan_alkes.alkes_code ' +
                'left outer join db_fasyankes.ruang_alkes on db_fasyankes.ruang_alkes.id_kat = db_fasyankes.ketersediaan_alkes.ruang_alkes_id ' +
                'WHERE db_fasyankes.ketersediaan_alkes.kode_rs = ? ' +
                'ORDER BY db_fasyankes.alkes.name'

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


        // const sqlSelect = 'SELECT ' +
        //     'db_fasyankes.ketersediaan_alkes.alkes_code, db_fasyankes.alkes.name as nama, db_fasyankes.ketersediaan_alkes.standar, ' +
        //     'db_fasyankes.ketersediaan_alkes.jumlah, db_fasyankes.ketersediaan_alkes.rusak, db_fasyankes.ruang_alkes.name as ruang ' +
        //     'FROM ' +
        //     'db_fasyankes.ketersediaan_alkes INNER JOIN db_fasyankes.alkes ' +
        //     'ON db_fasyankes.alkes.code = db_fasyankes.ketersediaan_alkes.alkes_code ' +
        //     'left outer join db_fasyankes.ruang_alkes on db_fasyankes.ruang_alkes.id_kat = db_fasyankes.ketersediaan_alkes.ruang_alkes_id ' +
        //     'WHERE db_fasyankes.ketersediaan_alkes.kode_rs = ? ' +
        //     'ORDER BY db_fasyankes.alkes.name'
        
        // const sqlFilterValue = [
        //     data
        // ]

        // const database = new Database(pool)
        // database.query(sqlSelect, sqlFilterValue)
        // .then(
        //     (res) => {
        //         callback(null, res)
        //     },(error) => {
        //         throw error
        //     }
        // )
        // .catch((error) => {
        //         callback(error, null)
        //     }
        // )
    }
}

module.exports = KetersediaanAlkes