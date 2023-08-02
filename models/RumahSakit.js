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
                    'db_fasyankes.`data`.TELEPON AS telepon, ' +
                    'db_fasyankes.`data`.WEBSITE AS website, ' +
                    'db_fasyankes.`m_blu`.blu AS statusBLU, ' +
                    'db_fasyankes.`data`.NO_SURAT_IJIN AS noSuratIjinOperasional, ' +
                    'db_fasyankes.`data`.TANGGAL_SURAT_IJIN AS tanggalSuratIjinOperasional, ' +
                    'db_fasyankes.`data`.DIREKTUR_RS AS direktur, ' +
                    'db_fasyankes.m_simrs.simrs AS ketersediaanSIMRS, ' +
                    'db_fasyankes.`data`.LUAS_TANAH AS luasTanah, ' +
                    'db_fasyankes.`data`.LUAS_BANGUNAN AS luasBangunan, ' +
                    'db_fasyankes.m_kepemilikan.kepemilikan AS kepemilikan, ' +
                    'db_fasyankes.m_blu.blu as statusBLU, ' +
                    'db_fasyankes.t_dok_tariflayanan_rs.url as urlTarif, ' +
                    'db_fasyankes.t_dok_tariflayanan_rs.status_validasi as statusValidasiTarif, ' +
                    'db_fasyankes.`data`.ALAMAT AS alamat, ' +
                    'db_fasyankes.`data`.provinsi_id, ' +
                    'db_fasyankes.provinsi.nama as provinsiNama, ' +
                    'db_fasyankes.`data`.kab_kota_id, ' +
                    'db_fasyankes.kab_kota.nama as kabKotaNama, ' +
                    'db_fasyankes.koordinat.long as longitude, ' +
                    'db_fasyankes.koordinat.alt as latitude, ' +
                    'db_fasyankes.`data`.aktive as statusAktivasi, ' +
                    'derivedtable2.url as urlFotoDepan, ' +
                    'db_fasyankes.`data`.TANGGAL_UPDATE as modified_at '

                    const sqlFrom = 'FROM ' +
                    '(SELECT ' +
                    'db_fasyankes.`data`.Propinsi as faskesId ' +
                    'FROM ' +
                        'db_fasyankes.`data` ' +
                        'INNER JOIN db_fasyankes.t_pelayanan ON db_fasyankes.t_pelayanan.koders = db_fasyankes.`data`.Propinsi ' +
                        'INNER JOIN db_fasyankes.m_pelayanan ON db_fasyankes.m_pelayanan.kode_pelayanan = db_fasyankes.t_pelayanan.kode_pelayanan ' +
                    'WHERE ' +
                        'db_fasyankes.m_pelayanan.pelayanan LIKE ? ' +
                    'GROUP BY db_fasyankes.`data`.Propinsi) derivedTable1 ' +
                    'INNER JOIN db_fasyankes.`data` ON db_fasyankes.`data`.Propinsi = derivedTable1.faskesId ' +
                    'LEFT OUTER JOIN db_fasyankes.provinsi ON db_fasyankes.provinsi.id = db_fasyankes.`data`.provinsi_id ' +
                    'LEFT OUTER JOIN db_fasyankes.kab_kota ON db_fasyankes.kab_kota.id = db_fasyankes.`data`.kab_kota_id ' +
                    'LEFT OUTER JOIN db_fasyankes.m_jenis ' +
                    'ON db_fasyankes.m_jenis.id_jenis = db_fasyankes.`data`.JENIS ' +
                    'LEFT OUTER JOIN db_fasyankes.m_kelas ' +
                    'ON db_fasyankes.m_kelas.id_kelas = db_fasyankes.`data`.KLS_RS ' +
                    'LEFT OUTER JOIN db_fasyankes.m_kepemilikan ' +
                    'ON db_fasyankes.m_kepemilikan.id_kepemilikan = db_fasyankes.`data`.PENYELENGGARA ' +
                    'LEFT OUTER JOIN db_fasyankes.m_blu ON db_fasyankes.m_blu.id_blu = db_fasyankes.`data`.blu  ' +
                    'LEFT OUTER JOIN db_fasyankes.koordinat ON db_fasyankes.koordinat.koders = db_fasyankes.`data`.propinsi ' +
                    'LEFT OUTER JOIN db_fasyankes.m_simrs ON db_fasyankes.m_simrs.id_simrs = db_fasyankes.`data`.simrs ' +
                    'LEFT OUTER JOIN db_fasyankes.t_dok_tariflayanan_rs on db_fasyankes.t_dok_tariflayanan_rs.koders = db_fasyankes.`data`.Propinsi ' +
                    'LEFT OUTER JOIN ( ' +
                        'SELECT db_fasyankes.t_images.koders, db_fasyankes.t_images.url ' +
                        'FROM db_fasyankes.t_images ' +
                        'WHERE db_fasyankes.t_images.keterangan = "depan" ' +
                    ') derivedtable2 ON derivedtable2.koders = db_fasyankes.`data`.Propinsi '

                const sqlOrder = ' ORDER BY db_fasyankes.`data`.RUMAH_SAKIT ' 

                const sqlWhere = 'WHERE '

                const filter = []
                const sqlFilterValue = []

                const pelayananNama = req.query.pelayanan || ""
                const provinsiId = req.query.provinsiId || null
                const kabKotaId = req.query.kabKotaId || null
                const nama = req.query.nama || null
                const aktive = req.query.aktive || null

                if (pelayananNama != null) {
                    sqlFilterValue.push('%'.concat(pelayananNama).concat('%'))
                }

                if (provinsiId != null) {
                    filter.push("db_fasyankes.`data`.provinsi_id = ?")
                    sqlFilterValue.push(provinsiId)
                }

                if (kabKotaId != null) {
                    filter.push("db_fasyankes.`data`.kab_kota_id = ?")
                    sqlFilterValue.push(kabKotaId)
                }

                if (nama != null) {
                    filter.push("db_fasyankes.`data`.RUMAH_SAKIT like ?")
                    sqlFilterValue.push('%'.concat(nama).concat('%'))
                }

                if (aktive != null) {
                    filter.push("db_fasyankes.`data`.aktive = ?")
                    sqlFilterValue.push(aktive)
                }

                let sqlFilter = ''
                if (filter.length == 0) {
                    sqlFilter = 'WHERE db_fasyankes.`data`.Propinsi NOT IN ("9999999","7371435","7371121","") AND db_fasyankes.`data`.JENIS <> 20 '
                } else {
                    filter.forEach((value, index) => {
                        if (index == 0) {
                            sqlFilter = sqlWhere.concat(value)
                        } else if (index > 0) {
                            sqlFilter = sqlFilter.concat(' and ').concat(value)
                        }
                    })
                }

                const sql = sqlSelect.concat(sqlFrom).concat(sqlFilter).concat(sqlOrder)
                
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

    getAllForDTO(req, callback) {
        const database = new Database(pool)

        const sqlSelect = 'SELECT db_fasyankes.`data`.Propinsi as kode, ' +
        'db_fasyankes.`data`.RUMAH_SAKIT AS nama, ' +
        'db_fasyankes.m_jenis.alias AS jenis, ' +
        'db_fasyankes.m_kelas.kelas AS kelas, ' +
        'db_fasyankes.m_kepemilikan.kepemilikan AS kepemilikan, ' +
        'db_fasyankes.m_blu.blu as statusBLU, ' +
        'db_fasyankes.`data`.nama_penyelenggara as namaPenyelenggara, ' +
        'db_fasyankes.`data`.luas_tanah as luasTanah, ' +
        'db_fasyankes.`data`.luas_bangunan as luasBangunan, ' +
        'db_fasyankes.`data`.DIREKTUR_RS AS direktur, ' +
        'db_fasyankes.`data`.alamat, ' +
        'db_fasyankes.`data`.email as email, ' +
        'db_fasyankes.`data`.website as website, ' +
        'db_fasyankes.`data`.NO_SURAT_IJIN as noSuratIzinOperasional, ' +
        'db_fasyankes.`data`.TANGGAL_SURAT_IJIN as tanggalSuratIzinOperasional, ' +
        'db_fasyankes.`data`.MASA_BERLAKU_SURAT_IJIN as masaBerlakuSuratIzinOperasional, ' +
        'db_fasyankes.`data`.PENTAHAPAN_AKREDITASI as pentahapanAkreditasi, ' +
        'db_fasyankes.`data`.STATUS_AKREDITASI as statusAkreditasi, ' +
        'db_fasyankes.`data`.Tglakreditas as tanggalAkreditasi, ' +
        'db_fasyankes.`data`.masa_berlaku_akreditasi as masaBerlakuAkreditasi, ' +
        'db_fasyankes.`data`.layanan_unggulan as layananUnggulan, ' +
        'db_fasyankes.`data`.simrs as simRS, ' +
        'db_fasyankes.`data`.bank_darah as bankDarah, ' +
        'db_fasyankes.`data`.provinsi_id as provinsiIdKemDagri, ' +
        'db_fasyankes.`data`.kab_kota_id as kabKotaIdKemDagri, ' +
        'db_fasyankes.`kab/kota`.`KAB/KOTA` AS kab_kota, ' +
        'db_fasyankes.propinsi.propinsi_name AS propinsi, ' +
        'db_fasyankes.`data`.TELEPON AS telepon '

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
        'INNER JOIN db_fasyankes.m_blu ON db_fasyankes.m_blu.id_blu = db_fasyankes.`data`.blu '

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
    }

    getAllForDTOKemDagri(req, callback) {
        const database = new Database(pool)

        const sqlSelect = 'SELECT db_fasyankes.`data_rs_mendagri`.Propinsi as kode, ' +
        'db_fasyankes.`data_rs_mendagri`.RUMAH_SAKIT AS nama, ' +
        'db_fasyankes.m_jenis.alias AS jenis, ' +
        'db_fasyankes.m_kelas.kelas AS kelas, ' +
        'db_fasyankes.m_kepemilikan.kepemilikan AS kepemilikan, ' +
        'db_fasyankes.m_blu.blu as statusBLU, ' +
        'db_fasyankes.`data_rs_mendagri`.nama_penyelenggara as namaPenyelenggara, ' +
        'db_fasyankes.`data_rs_mendagri`.luas_tanah as luasTanah, ' +
        'db_fasyankes.`data_rs_mendagri`.luas_bangunan as luasBangunan, ' +
        'db_fasyankes.`data_rs_mendagri`.DIREKTUR_RS AS direktur, ' +
        'db_fasyankes.`data_rs_mendagri`.alamat, ' +
        'db_fasyankes.`data_rs_mendagri`.email as email, ' +
        'db_fasyankes.`data_rs_mendagri`.website as website, ' +
        'db_fasyankes.`data_rs_mendagri`.NO_SURAT_IJIN as noSuratIzinOperasional, ' +
        'db_fasyankes.`data_rs_mendagri`.TANGGAL_SURAT_IJIN as tanggalSuratIzinOperasional, ' +
        'db_fasyankes.`data_rs_mendagri`.MASA_BERLAKU_SURAT_IJIN as masaBerlakuSuratIzinOperasional, ' +
        'db_fasyankes.`data_rs_mendagri`.PENTAHAPAN_AKREDITASI as pentahapanAkreditasi, ' +
        'db_fasyankes.`data_rs_mendagri`.STATUS_AKREDITASI as statusAkreditasi, ' +
        'db_fasyankes.`data_rs_mendagri`.Tglakreditas as tanggalAkreditasi, ' +
        'db_fasyankes.`data_rs_mendagri`.masa_berlaku_akreditasi as masaBerlakuAkreditasi, ' +
        'db_fasyankes.`data_rs_mendagri`.layanan_unggulan as layananUnggulan, ' +
        'db_fasyankes.`data_rs_mendagri`.simrs as simRS, ' +
        'db_fasyankes.`data_rs_mendagri`.bank_darah as bankDarah, ' +
        'db_fasyankes.`data_rs_mendagri`.provinsi_id as provinsiIdKemDagri, ' +
        'db_fasyankes.`data_rs_mendagri`.kab_kota_id as kabKotaIdKemDagri, ' +
        'db_fasyankes.`kab/kota`.`KAB/KOTA` AS kab_kota, ' +
        'db_fasyankes.propinsi.propinsi_name AS propinsi, ' +
        'db_fasyankes.`data_rs_mendagri`.TELEPON AS telepon '

        const sqlFrom = 'FROM db_fasyankes.`data_rs_mendagri` INNER JOIN db_fasyankes.propinsi ' +
        'ON db_fasyankes.propinsi.propinsi_kode = db_fasyankes.`data_rs_mendagri`.usrpwd2 ' +
        'INNER JOIN db_fasyankes.`kab/kota` ' +
        'ON db_fasyankes.`kab/kota`.link = db_fasyankes.`data_rs_mendagri`.link ' +
        'INNER JOIN db_fasyankes.m_jenis ' +
        'ON db_fasyankes.m_jenis.id_jenis = db_fasyankes.`data_rs_mendagri`.JENIS ' +
        'INNER JOIN db_fasyankes.m_kelas ' +
        'ON db_fasyankes.m_kelas.id_kelas = db_fasyankes.`data_rs_mendagri`.KLS_RS ' +
        'INNER JOIN db_fasyankes.m_kepemilikan ' +
        'ON db_fasyankes.m_kepemilikan.id_kepemilikan = db_fasyankes.`data_rs_mendagri`.PENYELENGGARA ' +
        'INNER JOIN db_fasyankes.m_blu ON db_fasyankes.m_blu.id_blu = db_fasyankes.`data_rs_mendagri`.blu '

        const sqlOrder = 'ORDER BY db_fasyankes.propinsi.propinsi_kode, db_fasyankes.`kab/kota`.link'

        const sqlWhere = 'WHERE '

        const filter = []

        const nama = req.query.nama || null

        if (nama != null) {
            filter.push("db_fasyankes.`data_rs_mendagri`.RUMAH_SAKIT like ?")
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
                'db_fasyankes.`data`.TELEPON AS telepon, ' +
                'db_fasyankes.m_blu.blu as statusBLU, ' +
                'db_fasyankes.koordinat.long, ' +
                'db_fasyankes.koordinat.alt ' +
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
                'INNER JOIN db_fasyankes.m_blu ' +
                'ON db_fasyankes.m_blu.id_blu = db_fasyankes.`data`.blu ' + 
                'INNER JOIN db_fasyankes.koordinat ' +
                'ON db_fasyankes.`data`.propinsi = db_fasyankes.koordinat.koders ' +
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