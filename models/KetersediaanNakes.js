const pool = require('../configs/pool')
const Database = require('./Database')

class KetersediaanAlkes {
    getData(req, callback) {
        const database = new Database(pool)
        const sqlUserScope = 'SELECT db_api_auth.scope.id ' +
            'FROM db_api_auth.scope ' +
            'WHERE db_api_auth.scope.user_id = ? ' +
            'AND db_api_auth.scope.endpoint_id = 5'

        const sqlFilterValueUserScope = [req.user.id]

        database.query(sqlUserScope, sqlFilterValueUserScope)
        .then(
            (resUserScope) => { 
                if (resUserScope.length == 0){
                    return callback("not allowed", [])
                }

                const sqlSelect = 'SELECT db_fasyankes.nakes_pekerjaan_dua.nama, ' +
                'db_fasyankes.nakes_pekerjaan_dua.no_sip as sip, ' +
                'db_fasyankes.nakes_pekerjaan_dua.no_str as str, ' +
                'db_fasyankes.nakes_pekerjaan_dua.jenis_nakes_nama as jenis_nakes, ' +
                'db_fasyankes.nakes_pekerjaan_dua.sub_kategori_nakes_nama as subkategori_nakes ' +
                'FROM db_fasyankes.nakes_pekerjaan_dua ' +
                'WHERE db_fasyankes.nakes_pekerjaan_dua.kode_rs = ? ' +
                'AND db_fasyankes.nakes_pekerjaan_dua.is_active = 1'
                'ORDER BY db_fasyankes.nakes_pekerjaan_dua.jenis_nakes_id'

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

        // const sqlSelect = 'SELECT db_fasyankes.nakes_pekerjaan_dua.nama, ' +
        // 'db_fasyankes.nakes_pekerjaan_dua.no_sip as sip, ' +
        // 'db_fasyankes.nakes_pekerjaan_dua.no_str as str, ' +
        // 'db_fasyankes.nakes_pekerjaan_dua.jenis_nakes_nama as jenis_nakes, ' +
        // 'db_fasyankes.nakes_pekerjaan_dua.sub_kategori_nakes_nama as subkategori_nakes ' +
        // 'FROM db_fasyankes.nakes_pekerjaan_dua ' +
        // 'WHERE db_fasyankes.nakes_pekerjaan_dua.kode_rs = ? ' +
        // 'AND db_fasyankes.nakes_pekerjaan_dua.is_active = 1'
        // 'ORDER BY db_fasyankes.nakes_pekerjaan_dua.jenis_nakes_id'
        
        // const sqlFilterValue = [
        //     data
        // ]

        // // const database = new Database(pool)
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

    insertData(data, callback) {
        const record = [
            data.pekerjaan_id,
            data.biodata_id,
            data.kode_rs,
            data.nama,
            data.nik,
            data.no_str,
            data.no_sip,
            data.jenis_nakes_id,
            data.jenis_nakes_nama,
            data.sub_kategori_nakes_id,
            data.sub_kategori_nakes_nama,
            1
        ]

        const sqlInsert = 'INSERT INTO db_fasyankes.nakes_pekerjaan_dua ' +
        '(id, biodata_id, kode_rs, nama, nik, no_str, ' +
        'no_sip, jenis_nakes_id, jenis_nakes_nama, sub_kategori_nakes_id, ' +
        'sub_kategori_nakes_nama, is_active) ' +
        'VALUES ( ? )'

        const database = new Database(pool)
        database.query(sqlInsert, [record])
        .then(
            (res) => {
                callback(null, res)
            }
        )
        .catch(
            (error) => {
                callback(error, null)
            }
        )
    }

    updateData(data, id, callback) {
        const database = new Database(pool)
        const sql = 'UPDATE db_fasyankes.nakes_pekerjaan_dua SET nama=?, nik=?, no_str=?, no_sip=?, ' +
            'jenis_nakes_id=?, jenis_nakes_nama=?, sub_kategori_nakes_id=?,' +
            'sub_kategori_nakes_nama=?, is_active=? ' +
        'WHERE id = ?'
        const trans_id = parseInt(id)
        const sqlValue = [
            data.nama,
            data.nik,
            data.no_str,
            data.no_sip,
            data.jenis_nakes_id,
            data.jenis_nakes_nama,
            data.sub_kategori_nakes_id,
            data.sub_kategori_nakes_nama,
            data.is_active,
            trans_id
        ]
        
        database.query(sql, sqlValue)
        .then(
            (res) => {
                if (res.affectedRows === 0 && res.changedRows === 0) {
                    callback(null, 'row not matched');
                    return
                }
                let resourceUpdated = {
                    id: trans_id
                } 
                callback(null, resourceUpdated);
            },(error) => {
                throw error
            }
        ).catch((error) => {
            callback(error, null)
        })
    }

    softDeleteData(id, callback) {
        const database = new Database(pool)
        const sql = 'UPDATE db_fasyankes.nakes_pekerjaan_dua SET is_active=0 ' +
        'WHERE id = ?'
        const trans_id = parseInt(id)
        const sqlValue = [
            trans_id
        ]
        
        database.query(sql, sqlValue)
        .then(
            (res) => {
                if (res.affectedRows === 0 && res.changedRows === 0) {
                    callback(null, 'row not matched');
                    return
                }
                let resourceUpdated = {
                    id: trans_id
                } 
                callback(null, resourceUpdated);
            },(error) => {
                throw error
            }
        ).catch((error) => {
            callback(error, null)
        })
    }

}

module.exports = KetersediaanAlkes