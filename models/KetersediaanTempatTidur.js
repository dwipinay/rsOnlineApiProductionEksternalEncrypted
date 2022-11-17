const pool = require('../configs/pool')
const Database = require('./Database')
const dateFormat = require('dateformat')

class KetersediaanTempatTidur {
    getData(req, callback) {
        const database = new Database(pool)
        const sqlUserScope = 'SELECT db_api_auth.scope.id ' +
            'FROM db_api_auth.scope ' +
            'WHERE db_api_auth.scope.user_id = ? ' +
            'AND db_api_auth.scope.endpoint_id = 3'

        const sqlFilterValueUserScope = [req.user.id]

        database.query(sqlUserScope, sqlFilterValueUserScope)
        .then(
            (resUserScope) => { 
                if (resUserScope.length == 0){
                    return callback("not allowed", [])
                }

                const kode_propinsi = req.query.kode_propinsi || null
                const kode_kab_kota = req.query.kode_kab_kota || null
                const id_tt = req.query.id_tt || null
                const tgl_update = req.query.tgl_update || null
                const kode_rs = req.query.kode_rs || null
                
                const sqlSelect = 'select db_fasyankes.`t_tempat_tidur`.`koders` as kode_rs, ' +
                    'left(db_fasyankes.`data`.`usrpwd2`,2) as kode_propinsi, ' +
                    'db_fasyankes.`data`.`link` as kode_kab_kota, db_fasyankes.`kab/kota`.`KAB/KOTA` as nama_kab_kota, ' +
                    'db_fasyankes.`data`.`RUMAH_SAKIT` as nama_rs, db_fasyankes.`t_tempat_tidur`.`id_tt`, ' +
                    'db_fasyankes.`m_tempat_tidur`.`tt`,db_fasyankes.`t_tempat_tidur`.`ruang`, ' +
                    'db_fasyankes.`t_tempat_tidur`.`jumlah`, db_fasyankes.`t_tempat_tidur`.`terpakai`, ' +
                    '(db_fasyankes.`t_tempat_tidur`.`jumlah` - db_fasyankes.`t_tempat_tidur`.`terpakai`) as kosong, ' +
                    'db_fasyankes.`t_tempat_tidur`.`antrian`, db_fasyankes.`t_tempat_tidur`.`tglupdate` '

                const sqlFrom = 'from db_fasyankes.`t_tempat_tidur` inner join db_fasyankes.`m_tempat_tidur` ' +
                    'on db_fasyankes.`m_tempat_tidur`.`id_tt` = db_fasyankes.`t_tempat_tidur`.`id_tt` ' +
                    'inner join db_fasyankes.`data` on db_fasyankes.`data`.`Propinsi` = db_fasyankes.`t_tempat_tidur`.`koders` ' +
                    'inner join db_fasyankes.`kab/kota` on db_fasyankes.`kab/kota`.`link` = db_fasyankes.`data`.`link` '
                const sqlWhere = 'where '

                const filter = [
                    "db_fasyankes.`m_tempat_tidur`.`status` = 1"
                ]
                const sqlFilterValue = []

                if (kode_propinsi != null) {
                    filter.push("db_fasyankes.`data`.`usrpwd2` = ?")
                    sqlFilterValue.push(kode_propinsi.concat('prop'))
                }

                if (kode_kab_kota != null) {
                    filter.push("db_fasyankes.`data`.`link` = ?")
                    sqlFilterValue.push(kode_kab_kota)
                }

                if (kode_rs != null) {
                    filter.push("db_fasyankes.t_tempat_tidur.koders = ?")
                    sqlFilterValue.push(kode_rs)
                }

                if (id_tt != null) {
                    filter.push("db_fasyankes.`t_tempat_tidur`.`id_tt` = ?")
                    sqlFilterValue.push(id_tt)
                }

                if (tgl_update !== null) {
                    filter.push("date_format(db_fasyankes.`t_tempat_tidur`.`tglupdate`, '%Y-%m-%d') = ?")
                    sqlFilterValue.push(tgl_update)
                }

                if (kode_rs != null) {
                    filter.push("db_fasyankes.`data`.`propinsi` in ( ? )")
                    sqlFilterValue.push(kode_rs)
                }

                let sqlFilter = null
                filter.forEach((value, index) => {
                    if (index == 0) {
                        sqlFilter = sqlWhere.concat(value)
                    } else if (index != 0) {
                        sqlFilter = sqlFilter.concat(' and ').concat(value)
                    }
                })

                const sqlOrderBy = ' order by db_fasyankes.`kab/kota`.`link`, db_fasyankes.`data`.`Propinsi`, db_fasyankes.`t_tempat_tidur`.`id_tt`'
                const sql = sqlSelect.concat(sqlFrom).concat(sqlFilter).concat(sqlOrderBy)

                database.query(sql, sqlFilterValue).then(
                    (res) => {
                        let kodeRS = null
                        let results = []
                        let resultDetails = []
                        res.forEach(element => {
                            if (kodeRS != element['kode_rs']) {
                                res.forEach(element2 => {
                                    if (element['kode_rs'] == element2['kode_rs']) {
                                        resultDetails.push({
                                            id_tt: element2['id_tt'],
                                            tt: element2['tt'],
                                            ruang: element2['ruang'],
                                            jumlah: element2['jumlah'],
                                            terpakai: element2['terpakai'],
                                            kosong: element2['kosong'],
                                            antrian: element2['antrian'],
                                            tgl_update: dateFormat(element2['tglupdate'], 'yyyy-mm-dd HH:MM:ss'),
                                            tgl_saat_ini: dateFormat(element2['tgl_saat_ini'], 'yyyy-mm-dd HH:MM:ss'),
                                            selisih_waktu: element2['selisih_waktu']
                                        })
                                    }
                                });
        
                                results.push({
                                    kode_rs: element['kode_rs'],
                                    nama_rs: element['nama_rs'],
                                    kode_propinsi: parseInt(element['kode_propinsi']),
                                    kode_kab_kota: element['kode_kab_kota'],
                                    nama_kab_kota: element['nama_kab_kota'],
                                    tempat_tidur: resultDetails
                                })
        
                                resultDetails = []
                                kodeRS = element['kode_rs']
                            }
                        })
                        callback(null, results)
                    },(error) => {
                        throw error
                    }
                ).catch((error) => {
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

        // const kode_propinsi = req.query.kode_propinsi || null
        // const id_tt = req.query.id_tt || null
        // const tgl_update = req.query.tgl_update || null
        // const kode_rs = req.query.kode_rs || null
        
        // const sqlSelect = 'select db_fasyankes.`t_tempat_tidur`.`koders` as kode_rs, ' +
        //     'left(db_fasyankes.`data`.`usrpwd2`,2) as kode_propinsi, ' +
        //     'db_fasyankes.`data`.`link` as kode_kab_kota, db_fasyankes.`kab/kota`.`KAB/KOTA` as nama_kab_kota, ' +
        //     'db_fasyankes.`data`.`RUMAH_SAKIT` as nama_rs, db_fasyankes.`t_tempat_tidur`.`id_tt`, ' +
        //     'db_fasyankes.`m_tempat_tidur`.`tt`,db_fasyankes.`t_tempat_tidur`.`ruang`, ' +
        //     'db_fasyankes.`t_tempat_tidur`.`jumlah`, db_fasyankes.`t_tempat_tidur`.`terpakai`, ' +
        //     '(db_fasyankes.`t_tempat_tidur`.`jumlah` - db_fasyankes.`t_tempat_tidur`.`terpakai`) as kosong, ' +
        //     'db_fasyankes.`t_tempat_tidur`.`antrian`, db_fasyankes.`t_tempat_tidur`.`tglupdate` '

        // const sqlFrom = 'from db_fasyankes.`t_tempat_tidur` inner join db_fasyankes.`m_tempat_tidur` ' +
        //     'on db_fasyankes.`m_tempat_tidur`.`id_tt` = db_fasyankes.`t_tempat_tidur`.`id_tt` ' +
        //     'inner join db_fasyankes.`data` on db_fasyankes.`data`.`Propinsi` = db_fasyankes.`t_tempat_tidur`.`koders` ' +
        //     'inner join db_fasyankes.`kab/kota` on db_fasyankes.`kab/kota`.`link` = db_fasyankes.`data`.`link` '
        // const sqlWhere = 'where '

        // const filter = [
        //     "db_fasyankes.`m_tempat_tidur`.`status` = 1"
        // ]
        // const sqlFilterValue = []

        // if (kode_propinsi != null) {
        //     filter.push("db_fasyankes.`data`.`usrpwd2` = ?")
        //     sqlFilterValue.push(kode_propinsi.concat('prop'))
        // }

        // if (kode_rs != null) {
        //     filter.push("db_fasyankes.t_tempat_tidur.koders = ?")
        //     sqlFilterValue.push(kode_rs)
        // }

        // if (id_tt != null) {
        //     filter.push("db_fasyankes.`t_tempat_tidur`.`id_tt` = ?")
        //     sqlFilterValue.push(id_tt)
        // }

        // if (tgl_update !== null) {
        //     filter.push("date_format(db_fasyankes.`t_tempat_tidur`.`tglupdate`, '%Y-%m-%d') = ?")
        //     sqlFilterValue.push(tgl_update)
        // }

        // if (kode_rs != null) {
        //     filter.push("db_fasyankes.`data`.`propinsi` in ( ? )")
        //     sqlFilterValue.push(kode_rs)
        // }

        // let sqlFilter = null
        // filter.forEach((value, index) => {
        //     if (index == 0) {
        //         sqlFilter = sqlWhere.concat(value)
        //     } else if (index != 0) {
        //         sqlFilter = sqlFilter.concat(' and ').concat(value)
        //     }
        // })

        // const sqlOrderBy = ' order by db_fasyankes.`kab/kota`.`link`, db_fasyankes.`data`.`Propinsi`, db_fasyankes.`t_tempat_tidur`.`id_tt`'
        // const sql = sqlSelect.concat(sqlFrom).concat(sqlFilter).concat(sqlOrderBy)

        // database.query(sql, sqlFilterValue).then(
        //     (res) => {
        //         let kodeRS = null
        //         let results = []
        //         let resultDetails = []
        //         res.forEach(element => {
        //             if (kodeRS != element['kode_rs']) {
        //                 res.forEach(element2 => {
        //                     if (element['kode_rs'] == element2['kode_rs']) {
        //                         resultDetails.push({
        //                             id_tt: element2['id_tt'],
        //                             tt: element2['tt'],
        //                             ruang: element2['ruang'],
        //                             jumlah: element2['jumlah'],
        //                             terpakai: element2['terpakai'],
        //                             kosong: element2['kosong'],
        //                             antrian: element2['antrian'],
        //                             tgl_update: dateFormat(element2['tglupdate'], 'yyyy-mm-dd HH:MM:ss'),
        //                             tgl_saat_ini: dateFormat(element2['tgl_saat_ini'], 'yyyy-mm-dd HH:MM:ss'),
        //                             selisih_waktu: element2['selisih_waktu']
        //                         })
        //                     }
        //                 });

        //                 results.push({
        //                     kode_rs: element['kode_rs'],
        //                     nama_rs: element['nama_rs'],
        //                     kode_propinsi: parseInt(element['kode_propinsi']),
        //                     kode_kab_kota: element['kode_kab_kota'],
        //                     nama_kab_kota: element['nama_kab_kota'],
        //                     tempat_tidur: resultDetails
        //                 })

        //                 resultDetails = []
        //                 kodeRS = element['kode_rs']
        //             }
        //         })
        //         callback(null, results)
        //     },(error) => {
        //         throw error
        //     }
        // ).catch((error) => {
        //         callback(error, null)
        //     }
        // )
    }
}

module.exports = KetersediaanTempatTidur