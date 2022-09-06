const pool = require('../configs/pool')
const Database = require('./Database')

class RumahSakit {
    getAll(req, callback) {
        const database = new Database(pool)

        const sqlUserScope = 'SELECT db_api_auth.scope.id ' +
            'FROM db_api_auth.scope ' +
            'WHERE db_api_auth.scope.user_id = ? ' +
            'AND db_api_auth.scope.endpoint_id = 1'

        const sqlFilterValueUserScope = [req.user.id]

        database.query(sqlUserScope, sqlFilterValueUserScope)
        .then(
            (resUserScope) => { 
                if (resUserScope.length == 0){
                    return callback("not allowed", [])
                }

                const sqlSelect = 'SELECT db_fasyankes.`data`.Propinsi as kode, ' +
                    'db_fasyankes.`data`.RUMAH_SAKIT AS nama, ' +
                    'db_fasyankes.m_jenis.alias AS jenis, ' +
                    'db_fasyankes.m_kelas.kelas AS kelas, ' +
                    'db_fasyankes.m_kepemilikan.kepemilikan AS kepemilikan, ' +
                    'db_fasyankes.`data`.DIREKTUR_RS AS direktur, ' +
                    'db_fasyankes.`data`.alamat, ' +
                    'db_fasyankes.`kab/kota`.`KAB/KOTA` AS kab_kota, ' +
                    'db_fasyankes.propinsi.propinsi_name AS propinsi, ' +
                    'db_fasyankes.`data`.TELEPON AS telepon, ' +
                    'db_fasyankes.m_blu.blu as statusBLU, ' +
                    'db_fasyankes.koordinat.long, ' +
                    'db_fasyankes.koordinat.alt '

                const sqlFrom = 'FROM db_fasyankes.`data` INNER JOIN db_fasyankes.propinsi ' +
                    'ON db_fasyankes.propinsi.propinsi_kode = db_fasyankes.`data`.usrpwd2 ' +
                    'INNER JOIN db_fasyankes.`kab/kota` ' +
                    'ON db_fasyankes.`kab/kota`.link = db_fasyankes.`data`.link ' +
                    'INNER JOIN db_fasyankes.m_jenis ' +
                    'ON db_fasyankes.m_jenis.id_jenis = db_fasyankes.`data`.JENIS ' +
                    'INNER JOIN db_fasyankes.m_kelas ' +
                    'ON db_fasyankes.m_kelas.id_kelas = db_fasyankes.`data`.KLS_RS ' +
                    'INNER JOIN db_fasyankes.m_kepemilikan ' +
                    'ON db_fasyankes.m_kepemilikan.id_kepemilikan = db_fasyankes.`data`.PENYELENGGARA ' +
                    'INNER JOIN db_fasyankes.m_blu ' +
                    'ON db_fasyankes.m_blu.id_blu = db_fasyankes.`data`.blu ' + 
                    'INNER JOIN db_fasyankes.koordinat ' +
                    'ON db_fasyankes.propinsi = db_fasyankes.koordinat '

                const sqlOrder = 'ORDER BY db_fasyankes.propinsi.propinsi_kode, db_fasyankes.`kab/kota`.link'

                const sqlWhere = 'WHERE '

                const filter = []

                const nama = req.query.nama || null

                if (nama != null) {
                    filter.push("db_fasyankes.`data`.RUMAH_SAKIT like ?")
                }

                let sqlFilter = ''
                filter.forEach((value, index) => {
                    if (index == 0) {
                        sqlFilter = sqlWhere.concat(value)
                    } else if (index > 0) {
                        sqlFilter = sqlFilter.concat(' and ').concat(value)
                    }
                })

                const sql = sqlSelect.concat(sqlFrom).concat(sqlFilter).concat(sqlOrder)
                
                database.query(sql, ['%' + nama + '%'])
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

        // const database = new Database(pool)
        
        // const sqlSelect = 'SELECT db_fasyankes.`data`.Propinsi as kode, ' +
        // 'db_fasyankes.`data`.RUMAH_SAKIT AS nama, ' +
        // 'db_fasyankes.m_jenis.alias AS jenis, ' +
        // 'db_fasyankes.m_kelas.kelas AS kelas, ' +
        // 'db_fasyankes.m_kepemilikan.kepemilikan AS kepemilikan, ' +
        // 'db_fasyankes.`data`.DIREKTUR_RS AS direktur, ' +
        // 'db_fasyankes.`data`.alamat, ' +
        // 'db_fasyankes.`kab/kota`.`KAB/KOTA` AS kab_kota, ' +
        // 'db_fasyankes.propinsi.propinsi_name AS propinsi, ' +
        // 'db_fasyankes.`data`.TELEPON AS telepon '

        // const sqlFrom = 'FROM db_fasyankes.`data` INNER JOIN db_fasyankes.propinsi ' +
        // 'ON db_fasyankes.propinsi.propinsi_kode = db_fasyankes.`data`.usrpwd2 ' +
        // 'INNER JOIN db_fasyankes.`kab/kota` ' +
        // 'ON db_fasyankes.`kab/kota`.link = db_fasyankes.`data`.link ' +
        // 'INNER JOIN db_fasyankes.m_jenis ' +
        // 'ON db_fasyankes.m_jenis.id_jenis = db_fasyankes.`data`.JENIS ' +
        // 'INNER JOIN db_fasyankes.m_kelas ' +
        // 'ON db_fasyankes.m_kelas.id_kelas = db_fasyankes.`data`.KLS_RS ' +
        // 'INNER JOIN db_fasyankes.m_kepemilikan ' +
        // 'ON db_fasyankes.m_kepemilikan.id_kepemilikan = db_fasyankes.`data`.PENYELENGGARA '

        // const sqlOrder = 'ORDER BY db_fasyankes.propinsi.propinsi_kode, db_fasyankes.`kab/kota`.link'

        // const sqlWhere = 'WHERE '

        // const filter = []

        // const nama = req.query.nama || null

        // if (nama != null) {
        //     filter.push("db_fasyankes.`data`.RUMAH_SAKIT like ?")
        // }

        // let sqlFilter = ''
        // filter.forEach((value, index) => {
        //     if (index == 0) {
        //         sqlFilter = sqlWhere.concat(value)
        //     } else if (index > 0) {
        //         sqlFilter = sqlFilter.concat(' and ').concat(value)
        //     }
        // })

        // const sql = sqlSelect.concat(sqlFrom).concat(sqlFilter).concat(sqlOrder)
        
        // database.query(sql, ['%' + nama + '%'])
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

    show(id, req, callback) {
        const database = new Database(pool)

        const sqlUserScope = 'SELECT db_api_auth.scope.id ' +
            'FROM db_api_auth.scope ' +
            'WHERE db_api_auth.scope.user_id = ? ' +
            'AND db_api_auth.scope.endpoint_id = 2'

        const sqlFilterValueUserScope = [req.user.id]

        database.query(sqlUserScope, sqlFilterValueUserScope)
        .then(
            (resUserScope) => { 
                if (resUserScope.length == 0){
                    return callback("not allowed", [])
                }

                const sql = 'SELECT db_fasyankes.`data`.Propinsi as kode, ' +
                'db_fasyankes.`data`.RUMAH_SAKIT AS nama, ' +
                'db_fasyankes.m_jenis.alias AS jenis, ' +
                'db_fasyankes.m_kelas.kelas AS kelas, ' +
                'db_fasyankes.m_kepemilikan.kepemilikan AS kepemilikan, ' +
                'db_fasyankes.`data`.DIREKTUR_RS AS direktur, ' +
                'db_fasyankes.`data`.alamat, ' +
                'db_fasyankes.`kab/kota`.`KAB/KOTA` AS kab_kota, ' +
                'db_fasyankes.propinsi.propinsi_name AS propinsi, ' +
                'db_fasyankes.`data`.TELEPON AS telepon ' +
                'FROM db_fasyankes.`data` INNER JOIN db_fasyankes.propinsi ' +
                'ON db_fasyankes.propinsi.propinsi_kode = db_fasyankes.`data`.usrpwd2 ' +
                'INNER JOIN db_fasyankes.`kab/kota` ' +
                'ON db_fasyankes.`kab/kota`.link = db_fasyankes.`data`.link ' +
                'INNER JOIN db_fasyankes.m_jenis ' +
                'ON db_fasyankes.m_jenis.id_jenis = db_fasyankes.`data`.JENIS ' +
                'INNER JOIN db_fasyankes.m_kelas ' +
                'ON db_fasyankes.m_kelas.id_kelas = db_fasyankes.`data`.KLS_RS ' +
                'INNER JOIN db_fasyankes.m_kepemilikan ' +
                'ON db_fasyankes.m_kepemilikan.id_kepemilikan = db_fasyankes.`data`.PENYELENGGARA ' +
                'WHERE db_fasyankes.`data`.Propinsi = ? '
                
                const sqlFilterValue = [id]
                database.query(sql, sqlFilterValue)
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

        // const database = new Database(pool)
        // const sql = 'SELECT db_fasyankes.`data`.Propinsi as kode, ' +
        // 'db_fasyankes.`data`.RUMAH_SAKIT AS nama, ' +
        // 'db_fasyankes.m_jenis.alias AS jenis, ' +
        // 'db_fasyankes.m_kelas.kelas AS kelas, ' +
        // 'db_fasyankes.m_kepemilikan.kepemilikan AS kepemilikan, ' +
        // 'db_fasyankes.`data`.DIREKTUR_RS AS direktur, ' +
        // 'db_fasyankes.`data`.alamat, ' +
        // 'db_fasyankes.`kab/kota`.`KAB/KOTA` AS kab_kota, ' +
        // 'db_fasyankes.propinsi.propinsi_name AS propinsi, ' +
        // 'db_fasyankes.`data`.TELEPON AS telepon ' +
        // 'FROM db_fasyankes.`data` INNER JOIN db_fasyankes.propinsi ' +
        // 'ON db_fasyankes.propinsi.propinsi_kode = db_fasyankes.`data`.usrpwd2 ' +
        // 'INNER JOIN db_fasyankes.`kab/kota` ' +
        // 'ON db_fasyankes.`kab/kota`.link = db_fasyankes.`data`.link ' +
        // 'INNER JOIN db_fasyankes.m_jenis ' +
        // 'ON db_fasyankes.m_jenis.id_jenis = db_fasyankes.`data`.JENIS ' +
        // 'INNER JOIN db_fasyankes.m_kelas ' +
        // 'ON db_fasyankes.m_kelas.id_kelas = db_fasyankes.`data`.KLS_RS ' +
        // 'INNER JOIN db_fasyankes.m_kepemilikan ' +
        // 'ON db_fasyankes.m_kepemilikan.id_kepemilikan = db_fasyankes.`data`.PENYELENGGARA ' +
        // 'WHERE db_fasyankes.`data`.Propinsi = ? '
        
        // const sqlFilterValue = [id]
        // database.query(sql, sqlFilterValue)
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

module.exports = RumahSakit