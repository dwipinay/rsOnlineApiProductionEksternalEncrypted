const pool = require('../configs/pool')
const Database = require('./Database')
const dateFormat = require('dateformat')
const axios = require('axios');

class Kematian {
    getAll(user, callback) {
        const database = new Database(pool)
        const sql = 'SELECT ' +
        'covid.kematian.id,' +
        'covid.kematian.nik,' +
        'covid.kematian.nama,' +
        'covid.kematian.jenis_kelamin_id,' +
        'covid.kematian.tanggal_lahir,' +
        'covid.kematian.alamat,' +
        'reference.kelurahan.nama AS kelurahan,' +
        'reference.kecamatan.nama AS kecamatan,' +
        'reference.kab_kota.nama AS kab_kota,' +
        'reference.provinsi.nama AS provinsi,' +
        'covid.kematian.kode_rs,' +
        'covid.kematian.tanggal_masuk,' +
        'covid.kematian.saturasi_oksigen,' +
        'covid.kematian.tanggal_kematian,' +
        'covid.lokasi_kematian.nama AS lokasi_kematian,' +
        'covid.kematian.penyebab_kematian_langsung_id ,' +
        'covid.kasus_kematian.nama AS kasus_kematian,' +
        'CASE ' +
            'WHEN covid.kematian.status_komorbid = 0 THEN "tidak" ' +
            'ELSE "ya" ' +
        'END AS status_komorbid,' +
        'covid.kematian.komorbid_1_id, ' +
        'covid.kematian.komorbid_2_id, ' +
        'covid.kematian.komorbid_3_id, ' +
        'covid.kematian.komorbid_4_id, ' +
        'CASE ' +
            'WHEN covid.kematian.status_kehamilan = 0 THEN "tidak" ' +
            'ELSE "ya" ' +
        'END AS "status_kehamilan" ' +
        'FROM ' +
        'covid.kematian ' + 
        'LEFT OUTER JOIN reference.kelurahan ' +
        'ON reference.kelurahan.id = covid.kematian.kelurahan_id ' +
        'INNER JOIN reference.kecamatan ' +
        'ON reference.kecamatan.id = covid.kematian.kecamatan_id  ' +
        'INNER JOIN reference.kab_kota ' +
        'ON reference.kab_kota.id = covid.kematian.kab_kota_id ' +
        'INNER JOIN reference.provinsi ' +
        'ON reference.provinsi.id = covid.kematian.provinsi_id ' +
        'INNER JOIN covid.lokasi_kematian ' +
        'ON covid.lokasi_kematian.id = covid.kematian.lokasi_kematian_id ' +
        'INNER JOIN covid.penyebab_kematian_langsung ' +
        'ON covid.penyebab_kematian_langsung.id = covid.kematian.penyebab_kematian_langsung_id ' +
        'INNER JOIN covid.kasus_kematian ' +
        'ON covid.kasus_kematian.id = covid.kematian.kasus_kematian_id ' +
        'LEFT OUTER JOIN covid.komorbid komorbid_1 ' +
        'ON komorbid_1.id = covid.kematian.komorbid_1_id ' +
        'LEFT OUTER JOIN covid.komorbid komorbid_2 ' +
        'ON komorbid_2.id = covid.kematian.komorbid_2_id ' +
        'LEFT OUTER JOIN covid.komorbid komorbid_3 ' +
        'ON komorbid_3.id = covid.kematian.komorbid_3_id ' +
        'LEFT OUTER JOIN covid.komorbid komorbid_4 ' +
        'ON komorbid_4.id = covid.kematian.komorbid_4_id ' +
        'WHERE covid.kematian.kode_rs = ?'

        const sqlFilterValue = [
            user.kode_rs
        ]

        database.query(sql, sqlFilterValue)
        .then(
            (res) => {
                const results = []
                res.forEach(element => {
                    results.push({
                        id: element['id'],
                        nik: element['nik'],
                        // nama: element['nama'],
                        // jenis_kelamin: element['jenis_kelamin_id'],
                        // tanggal_lahir: dateFormat(element['tanggal_lahir'], 'yyyy-mm-dd'),
                        // alamat: element['alamat'],
                        // kelurahan: element['kelurahan'],
                        // kecamatan: element['kecamatan'],
                        // kab_kota: element['kab_kota'],
                        // provinsi: element['provinsi'],
                        tanggal_masuk: dateFormat(element['tanggal_masuk'], 'yyyy-mm-dd'),
                        saturasi_oksigen: element['saturasi_oksigen'],
                        tanggal_kematian: dateFormat(element['tanggal_kematian'], 'yyyy-mm-dd'),
                        lokasi_kematian: element['lokasi_kematian'],
                        penyebab_kematian_langsung_id: element['penyebab_kematian_langsung_id'],
                        kasus_kematian: element['kasus_kematian'],
                        status_komorbid: element['status_komorbid'],
                        komorbid_1: element['komorbid_1_id'],
                        komorbid_2: element['komorbid_2_id'],
                        komorbid_3: element['komorbid_3_id'],
                        komorbid_4: element['komorbid_4_id'],
                        status_kehamilan: element['status_kehamilan']
                    })
                });
                callback(null, results)
            },(error) => {
                throw error
            }
        )
        .catch((error) => {
                callback(error, null)
            }
        )
    }

    insertData(data, callback) {
        if (data.nik == null) {
            let komorbid_1_id = null
            let komorbid_2_id = null
            let komorbid_3_id = null
            let komorbid_4_id = null

            if (data.status_komorbid ==  '1') {
                komorbid_1_id = data.komorbid_1_id
                komorbid_2_id = data.komorbid_2_id
                komorbid_3_id = data.komorbid_3_id
                komorbid_4_id = data.komorbid_4_id
            }

            const record = [
                data.nik,
                data.nama,
                data.jenis_kelamin,
                data.tanggal_lahir,
                data.ktp_alamat,
                data.ktp_kelurahan_id,
                data.ktp_kecamatan_id,
                data.ktp_kab_kota_id,
                data.ktp_provinsi_id,
                data.domisili_alamat,
                data.kode_rs,
                data.tanggal_masuk,
                data.saturasi_oksigen,
                data.tanggal_kematian,
                data.lokasi_kematian_id,
                data.penyebab_kematian_langsung_id,
                data.kasus_kematian_id,
                data.status_komorbid,
                komorbid_1_id,
                komorbid_2_id,
                komorbid_3_id,
                komorbid_4_id,
                data.status_kehamilan
            ]

            if (data.status_kehamilan != 0 && data.status_kehamilan != 1) {
                data.status_kehamilan = 1
            }

            if (data.jenis_kelamin == 'L' && data.status_kehamilan != "0") {
                const error = {
                    sqlMessage: 'Jenis Kelamin tidak sesuai dengan status kehamilan'
                }
                callback(error, null)
                return
            }

            const sqlInsert = 'INSERT INTO covid.`kematian` ' +
            '(`nik`, `nama`, `jenis_kelamin_id`, `tanggal_lahir`, '+
            '`alamat`, `kelurahan_id`, `kecamatan_id`, `kab_kota_id`, `provinsi_id`, `alamat_domisili`, ' +
            '`kode_rs`, `tanggal_masuk`, ' +
            '`saturasi_oksigen`, `tanggal_kematian`, `lokasi_kematian_id`, `penyebab_kematian_langsung_id`, ' +
            '`kasus_kematian_id`, `status_komorbid`, ' +
            '`komorbid_1_id`, `komorbid_2_id`, `komorbid_3_id`, `komorbid_4_id`, ' +
            '`status_kehamilan`) ' +
            'VALUES ( ? )'

            const database = new Database(pool)
            database.query(sqlInsert, [record])
            .then(
                (res) => {
                    let dataInserted = {
                        id: res.insertId,
                        nik : data.nik
                    }
                    callback(null, dataInserted)
                }
            )
            .catch(
                (error) => {
                    callback(error, null)
                }
            )
        } else if(data.nik != null) {
            if (data.nik.length != 16) {
                const error = {
                    sqlMessage: 'nik harus 16 digit'
                }
                callback(error, null)
                return
            }
    
            const endPoint = 'https://api.dto.kemkes.go.id/api/v2/sirs/nik_duk'
    
            const config = {
                headers: {
                    'Api-Kemkes': 'oNxjEVoCrMyvAE3ucJp5DI9bwHx7red7MNYiEIAN590=',
                    'Content-Type': 'application/json'
                }
            }
    
            const body = {
                'nik': data.nik
            }
    
            axios.post(endPoint, body, config)
            .then(response => {
                // console.log(response.data)
                if (response.data.result == 'Data ditemukan') {
                    let komorbid_1_id = null
                    let komorbid_2_id = null
                    let komorbid_3_id = null
                    let komorbid_4_id = null
    
                    if (data.status_komorbid ==  '1') {
                        komorbid_1_id = data.komorbid_1_id
                        komorbid_2_id = data.komorbid_2_id
                        komorbid_3_id = data.komorbid_3_id
                        komorbid_4_id = data.komorbid_4_id
                    }
    
                    const record = [
                        response.data.data.nik,
                        response.data.data.nama,
                        response.data.data.jenis_kelamin,
                        response.data.data.tgl_lahir,
                        response.data.data.ktp_alamat,
                        response.data.data.ktp_kode_desa,
                        response.data.data.ktp_kode_kecamatan,
                        response.data.data.ktp_kode_kabkot,
                        response.data.data.ktp_kode_prov,
                        response.data.data.domisili_alamat,
                        data.kode_rs,
                        data.tanggal_masuk,
                        data.saturasi_oksigen,
                        data.tanggal_kematian,
                        data.lokasi_kematian_id,
                        data.penyebab_kematian_langsung_id,
                        data.kasus_kematian_id,
                        data.status_komorbid,
                        komorbid_1_id,
                        komorbid_2_id,
                        komorbid_3_id,
                        komorbid_4_id,
                        data.status_kehamilan
                    ]
    
                    if (response.data.data.tgl_lahir != data.tanggal_lahir) {
                        const error = {
                            sqlMessage: 'NIK tidak sesuai dengan tanggal lahir'
                        }
                        callback(error, null)
                        return
                    }
    
                    if (data.status_kehamilan != 0 && data.status_kehamilan != 1) {
                        data.status_kehamilan = 1
                    }
    
                    if (response.data.data.jenis_kelamin == 'L' && data.status_kehamilan != "0") {
                        const error = {
                            sqlMessage: 'Jenis Kelamin tidak sesuai dengan status kehamilan'
                        }
                        callback(error, null)
                        return
                    }
    
                    const sqlInsert = 'INSERT INTO covid.`kematian` ' +
                    '(`nik`, `nama`, `jenis_kelamin_id`, `tanggal_lahir`, '+
                    '`alamat`, `kelurahan_id`, `kecamatan_id`, `kab_kota_id`, `provinsi_id`, `alamat_domisili`, ' +
                    '`kode_rs`, `tanggal_masuk`, ' +
                    '`saturasi_oksigen`, `tanggal_kematian`, `lokasi_kematian_id`, `penyebab_kematian_langsung_id`, ' +
                    '`kasus_kematian_id`, `status_komorbid`, ' +
                    '`komorbid_1_id`, `komorbid_2_id`, `komorbid_3_id`, `komorbid_4_id`, ' +
                    '`status_kehamilan`) ' +
                    'VALUES ( ? )'
    
                    const database = new Database(pool)
                    
                    database.query(sqlInsert, [record])
                    .then(
                        (res) => {
                            let dataInserted = {
                                id: res.insertId,
                                nik : data.nik
                            }
                            callback(null, dataInserted)
                        }
                    )
                    .catch(
                        (error) => {
                            callback(error, null)
                        }
                    )
                } else if (response.data.result == 'Data tidak ditemukan') {
                    const error = {
                        sqlMessage: 'NIK Tidak Ditemukan'
                    }
                    callback(error, null)

                    // let komorbid_1_id = null
                    // let komorbid_2_id = null
                    // let komorbid_3_id = null
                    // let komorbid_4_id = null

                    // if (data.status_komorbid ==  '1') {
                    //     komorbid_1_id = data.komorbid_1_id
                    //     komorbid_2_id = data.komorbid_2_id
                    //     komorbid_3_id = data.komorbid_3_id
                    //     komorbid_4_id = data.komorbid_4_id
                    // }

                    // const record = [
                    //     data.nik,
                    //     data.nama,
                    //     data.jenis_kelamin,
                    //     data.tanggal_lahir,
                    //     data.ktp_alamat,
                    //     data.ktp_kelurahan_id,
                    //     data.ktp_kecamatan_id,
                    //     data.ktp_kab_kota_id,
                    //     data.ktp_provinsi_id,
                    //     data.domisili_alamat,
                    //     2,
                    //     data.kode_rs,
                    //     data.tanggal_masuk,
                    //     data.saturasi_oksigen,
                    //     data.tanggal_kematian,
                    //     data.lokasi_kematian_id,
                    //     data.penyebab_kematian_langsung_id,
                    //     data.kasus_kematian_id,
                    //     data.status_komorbid,
                    //     komorbid_1_id,
                    //     komorbid_2_id,
                    //     komorbid_3_id,
                    //     komorbid_4_id,
                    //     data.status_kehamilan
                    // ]

                    // if (data.status_kehamilan != 0 && data.status_kehamilan != 1) {
                    //     data.status_kehamilan = 1
                    // }

                    // if (data.jenis_kelamin == 'L' && data.status_kehamilan != "0") {
                    //     const error = {
                    //         sqlMessage: 'Jenis Kelamin tidak sesuai dengan status kehamilan'
                    //     }
                    //     callback(error, null)
                    //     return
                    // }

                    // const sqlInsert = 'INSERT INTO covid.`kematian` ' +
                    // '(`nik`, `nama`, `jenis_kelamin_id`, `tanggal_lahir`, '+
                    // '`alamat`, `kelurahan_id`, `kecamatan_id`, `kab_kota_id`, `provinsi_id`, `alamat_domisili`, ' +
                    // '`sumber_data_kependudukan_id`, `kode_rs`, `tanggal_masuk`, ' +
                    // '`saturasi_oksigen`, `tanggal_kematian`, `lokasi_kematian_id`, `penyebab_kematian_langsung_id`, ' +
                    // '`kasus_kematian_id`, `status_komorbid`, ' +
                    // '`komorbid_1_id`, `komorbid_2_id`, `komorbid_3_id`, `komorbid_4_id`, ' +
                    // '`status_kehamilan`) ' +
                    // 'VALUES ( ? )'

                    // const database = new Database(pool)
                    // database.query(sqlInsert, [record])
                    // .then(
                    //     (res) => {
                    //         let dataInserted = {
                    //             id: res.insertId,
                    //             nik : data.nik
                    //         }
                    //         callback(null, dataInserted)
                    //     }
                    // )
                    // .catch(
                    //     (error) => {
                    //         callback(error, null)
                    //     }
                    // )
                } else {
                    const error = {
                        sqlMessage: 'Undocumented Error'
                    }
                    callback(error, null)
                }
            },error => {
                throw error
            })
            .catch(error => {
                // console.log(error)
                callback(null, error)
            })
        }
    }

    updateData(data, id, callback) {
        const database = new Database(pool)
        const sql = 'UPDATE covid.kematian SET `tanggal_masuk`=?,`saturasi_oksigen`=?,`tanggal_kematian`=?,' +
            '`lokasi_kematian_id`=?,`penyebab_kematian_langsung_id`=?,`kasus_kematian_id`=?,' +
            '`status_komorbid`=?,`komorbid_1_id`=?,`komorbid_2_id`=?,`komorbid_3_id`=?,`komorbid_4_id`=? ' +
        'WHERE `id` = ? AND `kode_rs` = ?'
        const trans_id = parseInt(id)
        const sqlValue = [
            data.tanggal_masuk,
            data.saturasi_oksigen,
            data.tanggal_kematian,
            data.lokasi_kematian_id,
            data.penyebab_kematian_langsung_id,
            data.kasus_kematian_id,
            data.status_komorbid,
            data.komorbid_1_id,
            data.komorbid_2_id,
            data.komorbid_3_id,
            data.komorbid_4_id,
            // data.status_kehamilan,
            trans_id,
            data.kode_rs
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

    deleteData(data, id, callback) {
        const database = new Database(pool)
        const sql = 'DELETE FROM covid.kematian WHERE `id` = ? AND `kode_rs` = ?'
        const sqlValue = [
            parseInt(id),
            data
        ]

        database.query(sql, sqlValue)
        .then(
            (res) => {
                if (res.affectedRows === 0) {
                    callback(null, 'no row matched');
                    return;
                }
                callback(null, res)
            }, (error) => {
                throw error
            }
        ).catch((error) => {
            callback(error, null)
        })
    }
}

module.exports = Kematian