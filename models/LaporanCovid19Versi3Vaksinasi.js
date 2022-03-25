const pool = require('../configs/pool')
const Database = require('./Database')
const dateFormat = require('dateformat')
const axios = require('axios');

class LaporanCovid19Versi3Vaksinasi {
    getData(user, callback) {
        const database = new Database(pool)
        const sql = 'SELECT ' +
            'covid.t_vaksinasi_covid.id_t_vaksin as id, ' +
            'covid.t_vaksinasi_covid.id_trans as laporan_Covid19_Versi3_Id,' +
            'covid.covid_v3.nomr as no_rm,' +
            'covid.t_vaksinasi_covid.tahap_vaksin as dosis_vaksin_id, ' +
            'covid.m_vaksinasi.keterangan as dosis_vaksin_nama, ' +
            'covid.t_vaksinasi_covid.id_jenis_vaksin as jenis_vaksin_id, ' +
            'covid.m_jenis_vaksin.nama_vaksin as jenis_vaksin_nama ' +
            'FROM covid.t_vaksinasi_covid ' +
                'LEFT OUTER JOIN covid.m_vaksinasi ON covid.m_vaksinasi.tahap_vaksin = covid.t_vaksinasi_covid.tahap_vaksin ' +
                'LEFT OUTER JOIN covid.m_jenis_vaksin ON covid.m_jenis_vaksin.id_jenis_vaksin = covid.t_vaksinasi_covid.id_jenis_vaksin ' +
                'LEFT OUTER JOIN covid.covid_v3 ON covid.covid_v3.id_trans = covid.t_vaksinasi_covid.id_trans ' +
            'WHERE covid.covid_v3.koders = ? AND covid.covid_v3.tglkeluar = "0000-00-00" ' +
            'ORDER BY covid.t_vaksinasi_covid.id_t_vaksin'

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
                        laporanCovid19Versi3Id: element['laporan_Covid19_Versi3_Id'],
                        noRM: element['no_rm'],
                        dosisVaksin: {
                            id: element['dosis_vaksin_id'],
                            Nama: element['dosis_vaksin_nama'],
                        },
                        jenisVaksin: {
                            id: element['jenis_vaksin_id'],
                            nama: element['jenis_vaksin_nama'] 
                        }
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
            'covid.t_vaksinasi_covid.id_t_vaksin as id, ' +
            'covid.t_vaksinasi_covid.id_trans as laporan_Covid19_Versi3_Id,' +
            'covid.covid_v3.nomr as no_rm,' +
            'covid.t_vaksinasi_covid.tahap_vaksin as dosis_vaksin_id, ' +
            'covid.m_vaksinasi.keterangan as dosis_vaksin_nama, ' +
            'covid.t_vaksinasi_covid.id_jenis_vaksin as jenis_vaksin_id, ' +
            'covid.m_jenis_vaksin.nama_vaksin as jenis_vaksin_nama ' +
            'FROM covid.t_vaksinasi_covid ' +
                'LEFT OUTER JOIN covid.m_vaksinasi ON covid.m_vaksinasi.tahap_vaksin = covid.t_vaksinasi_covid.tahap_vaksin ' +
                'LEFT OUTER JOIN covid.m_jenis_vaksin ON covid.m_jenis_vaksin.id_jenis_vaksin = covid.t_vaksinasi_covid.id_jenis_vaksin ' +
                'LEFT OUTER JOIN covid.covid_v3 ON covid.covid_v3.id_trans = covid.t_vaksinasi_covid.id_trans ' +
            'WHERE covid.covid_v3.koders = ? AND  covid.t_vaksinasi_covid.id_t_vaksin = ? ' +
            'ORDER BY covid.t_vaksinasi_covid.id_t_vaksin'

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
                        laporanCovid19Versi3Id: element['laporan_Covid19_Versi3_Id'],
                        noRM: element['no_rm'],
                        dosisVaksin: {
                            id: element['dosis_vaksin_id'],
                            Nama: element['dosis_vaksin_nama'],
                        },
                        jenisVaksin: {
                            id: element['jenis_vaksin_id'],
                            nama: element['jenis_vaksin_nama'] 
                        }
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
                    data.dosisVaksinId,
                    data.jenisVaksinId,
                    data.laporanCovid19Versi3Id
                ]

                const sqlInsert = 'INSERT INTO covid.t_vaksinasi_covid ' +
                    '(covid.t_vaksinasi_covid.tahap_vaksin,covid.t_vaksinasi_covid.id_jenis_vaksin,covid.t_vaksinasi_covid.id_trans) ' +
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

    updateData(data, id, callback) {
        const laporanCovid19Versi3VaksinId = parseInt(id)
        
        const sqlValue = [
            data.dosisVaksinId,
            data.jenisVaksinId,
            laporanCovid19Versi3VaksinId,
            data.kodeRS
        ]

        const sql = 'UPDATE covid.t_vaksinasi_covid ' +
            'INNER JOIN covid.covid_v3 ON covid.covid_v3.id_trans = covid.t_vaksinasi_covid.id_trans ' +
            'SET ' +
            'covid.t_vaksinasi_covid.tahap_vaksin=?, ' +
            'covid.t_vaksinasi_covid.id_jenis_vaksin=? ' +
        'WHERE covid.t_vaksinasi_covid.id_t_vaksin = ? AND covid.covid_v3.koders = ?'

        const database = new Database(pool)
        database.query(sql, sqlValue)
        .then(
            (res) => {
                if (res.affectedRows === 0 && res.changedRows === 0) {
                    callback(null, 'no row matched');
                    return
                }
                let resourceUpdated = {
                    id: id
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

module.exports = LaporanCovid19Versi3Vaksinasi