const pool = require('../configs/pool')
const Database = require('./Database')
const dateFormat = require('dateformat')
const axios = require('axios');

class LaporanCovid19Versi3PemeriksaanLab {
    getData(req, callback) {
        const database = new Database(pool)
        const sqlSelect = 'SELECT ' +
            'covid.t_pemeriksaan.id_pemeriksaan as id,' +
            'covid.t_pemeriksaan.id_trans as laporan_Covid19_Versi3_id, ' +
            'covid.covid_v3.nomr as no_rm, ' +
            'covid.t_pemeriksaan.jenis_pemeriksaan as jenis_pemeriksaan_lab_id, ' +
            'covid.m_jenis_pemeriksaan.jenis_pemeriksaan as jenis_pemeriksaan_lab_nama, ' +
            'covid.t_pemeriksaan.hasil_pemeriksaan as hasil_pemeriksaan_lab_id, ' +
            'covid.m_hasiltest.status as hasil_pemeriksaan_lab_nama, ' +
            'covid.t_pemeriksaan.tgl_pemeriksaan as tanggal_hasil_pemeriksaan_lab '

        const sqlFrom = 'FROM covid.t_pemeriksaan ' +
            'LEFT OUTER JOIN covid.covid_v3 ON covid.covid_v3.id_trans = covid.t_pemeriksaan.id_trans ' +
            'LEFT OUTER JOIN covid.m_jenis_pemeriksaan ON covid.m_jenis_pemeriksaan.id_jenis_pemeriksaan = covid.t_pemeriksaan.jenis_pemeriksaan ' +
            'LEFT OUTER JOIN covid.m_hasiltest ON covid.m_hasiltest.id = covid.t_pemeriksaan.hasil_pemeriksaan '

        const sqlFilterValue = [
            req.user.kode_rs
        ]

        const sqlWhere = 'WHERE '

        const sqlOrder = ' ORDER BY covid.t_pemeriksaan.jenis_pemeriksaan'

        const filter = [
            'covid.covid_v3.tglkeluar = "0000-00-00"',
            'covid.covid_v3.koders = ?'
        ]

        const noRM = req.query.noRM || null
        if (noRM != null) {
            filter.push('covid.covid_v3.nomr = ?')
            sqlFilterValue.push(noRM)
        }

        let sqlFilter = ''
        filter.forEach((value, index) => {
            if (index == 0) {
                sqlFilter = sqlWhere.concat(value)
            } else if (index > 0) {
                sqlFilter = sqlFilter.concat(' AND ').concat(value)
            }
        })

        const sql = sqlSelect.concat(sqlFrom).concat(sqlFilter).concat(sqlOrder)

        database.query(sql, sqlFilterValue)
        .then(
            (res) => {
                const results = []
                res.forEach(element => {
                    results.push({
                        id: element['id'],
                        laporanCovid19Versi3Id: element['laporan_Covid19_Versi3_id'],
                        noRM: element['no_rm'],
                        jenisPemeriksaanLab: {
                            jenisPemeriksaanLabId: element['jenis_pemeriksaan_lab_id'],
                            jenisPemeriksaanLabNama: element['jenis_pemeriksaan_lab_nama'],
                        },
                        hasilPemeriksaanLab: {
                            hasilPemeriksaanLabId: element['hasil_pemeriksaan_lab_id'],
                            hasilPemeriksaanLabNama: element['hasil_pemeriksaan_lab_nama'],
                        },
                        tanggalHasilPemeriksaanLab: element['tanggal_hasil_pemeriksaan_lab']
                    })
                })
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

    show(user, id, callback) {
        const database = new Database(pool)
        const sql = 'SELECT ' +
            'covid.t_pemeriksaan.id_pemeriksaan as id,' +
            'covid.t_pemeriksaan.id_trans as laporan_Covid19_Versi3_id, ' +
            'covid.covid_v3.nomr as no_rm, ' +
            'covid.t_pemeriksaan.jenis_pemeriksaan as jenis_pemeriksaan_lab_id, ' +
            'covid.m_jenis_pemeriksaan.jenis_pemeriksaan as jenis_pemeriksaan_lab_nama, ' +
            'covid.t_pemeriksaan.hasil_pemeriksaan as hasil_pemeriksaan_lab_id, ' +
            'covid.m_hasiltest.status as hasil_pemeriksaan_lab_nama, ' +
            'covid.t_pemeriksaan.tgl_pemeriksaan as tanggal_hasil_pemeriksaan_lab ' +
        'FROM covid.t_pemeriksaan ' +
            'LEFT OUTER JOIN covid.covid_v3 ON covid.covid_v3.id_trans = covid.t_pemeriksaan.id_trans ' +
            'LEFT OUTER JOIN covid.m_jenis_pemeriksaan ON covid.m_jenis_pemeriksaan.id_jenis_pemeriksaan = covid.t_pemeriksaan.jenis_pemeriksaan ' +
            'LEFT OUTER JOIN covid.m_hasiltest ON covid.m_hasiltest.id = covid.t_pemeriksaan.hasil_pemeriksaan ' +
        'WHERE covid.covid_v3.koders = ? and covid.t_pemeriksaan.id_pemeriksaan = ? ' +
        'ORDER BY covid.t_pemeriksaan.jenis_pemeriksaan'

        const sqlFilterValue = [
            user.kode_rs,
            id
        ]

        database.query(sql, sqlFilterValue)
        .then(
            (res) => {
                const results = []
                res.forEach(element => {
                    results.push({
                        id: element['id'],
                        laporanCovid19Versi3Id: element['laporan_Covid19_Versi3_id'],
                        noRM: element['no_rm'],
                        jenisPemeriksaanLab: {
                            jenisPemeriksaanLabId: element['jenis_pemeriksaan_lab_id'],
                            jenisPemeriksaanLabNama: element['jenis_pemeriksaan_lab_nama'],
                        },
                        hasilPemeriksaanLab: {
                            hasilPemeriksaanLabId: element['hasil_pemeriksaan_lab_id'],
                            hasilPemeriksaanLabNama: element['hasil_pemeriksaan_lab_nama'],
                        },
                        tanggalHasilPemeriksaanLab: element['tanggal_hasil_pemeriksaan_lab']
                    })
                })
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
        const sqlFilter = 'SELECT ' +
            'covid.covid_v3.id_trans ' +
            'FROM covid.covid_v3 ' +
            'WHERE covid.covid_v3.id_trans = ? AND koders = ?'
        
        const sqlFilterValue = [data.laporanCovid19Versi3Id, data.kodeRS]

        const database = new Database(pool)
        database.query(sqlFilter, sqlFilterValue)
        .then(
            (res) => {
                if (res.length == 0) {
                    return callback(error, null);
                }

                const record = [
                    data.jenisPemeriksaanLabId,
                    data.hasilPemeriksaanLabId,
                    data.tanggalHasilPemeriksaanLab,
                    data.laporanCovid19Versi3Id
                ]

                const sqlInsert = 'INSERT INTO covid.t_pemeriksaan ' +
                    '( ' +
                        'covid.t_pemeriksaan.jenis_pemeriksaan, ' +
                        'covid.t_pemeriksaan.hasil_pemeriksaan, ' +
                        'covid.t_pemeriksaan.tgl_pemeriksaan, ' +
                        'covid.t_pemeriksaan.id_trans ' +
                    ') ' +
                    'VALUES ( ? )'

                return database.query(sqlInsert, [record])
            }
        )
        .then(
            (res) => {
                let dataInserted = {
                    id: res.insertId
                }
                callback(null, dataInserted)
            }, (error) => {
                throw error
            }
        )
        .catch((error) => {
            callback(error, null)
        })
    }
}

module.exports = LaporanCovid19Versi3PemeriksaanLab