const pool = require('../configs/pool')
const Database = require('./Database')
const dateFormat = require('dateformat')
const axios = require('axios');

class LaporanCovid19Versi3Obat {
    getData(user, callback) {
        const database = new Database(pool)
        const sql = 'SELECT ' +
            'covid.t_obat_covid.id_t_obat,' +
            'covid.covid_v3.id_trans as laporan_Covid19_Versi3_Id,' +
            'covid.covid_v3.nomr as no_rm,' +
            'covid.t_obat_covid.kodeobat as obat_id,' +
            'covid.m_kebutuhan.kebutuhan as obat_nama, ' +
            'covid.t_obat_covid.jumlah_obat ' +
            'FROM covid.t_obat_covid ' +
                'LEFT OUTER JOIN covid.m_kebutuhan ON covid.m_kebutuhan.id_kebutuhan = covid.t_obat_covid.kodeobat ' +
                'LEFT OUTER JOIN covid.covid_v3 ON covid.covid_v3.id_trans = covid.t_obat_covid.id_trans ' +
            'WHERE covid.covid_v3.koders = ? AND covid.covid_v3.tglkeluar = "0000-00-00" ' +
            'ORDER BY covid.m_kebutuhan.kebutuhan '

        const sqlFilterValue = [
            user.kode_rs
        ]

        database.query(sql, sqlFilterValue)
        .then(
            (res) => {
                const results = []
                res.forEach(element => {
                    results.push({
                        id: element['id_t_obat'],
                        laporanCovid19Versi3Id: element['laporan_Covid19_Versi3_Id'],
                        noRM: element['no_rm'],
                        terapi: {
                            terapiId: element['obat_id'],
                            terapiNama: element['obat_nama'],
                        },
                        jumlah: element['jumlah_obat']
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
            'covid.t_obat_covid.id_t_obat,' +
            'covid.covid_v3.id_trans as laporan_Covid19_Versi3_Id,' +
            'covid.covid_v3.nomr as no_rm,' +
            'covid.t_obat_covid.kodeobat as obat_id,' +
            'covid.m_kebutuhan.kebutuhan as obat_nama, ' +
            'covid.t_obat_covid.jumlah_obat ' +
            'FROM covid.t_obat_covid ' +
                'LEFT OUTER JOIN covid.m_kebutuhan ON covid.m_kebutuhan.id_kebutuhan = covid.t_obat_covid.kodeobat ' +
                'LEFT OUTER JOIN covid.covid_v3 ON covid.covid_v3.id_trans = covid.t_obat_covid.id_trans ' +
            'WHERE covid.covid_v3.koders = ? AND covid.t_obat_covid.id_t_obat = ? ' +
            'ORDER BY covid.m_kebutuhan.kebutuhan '

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
                        id: element['id_t_obat'],
                        laporanCovid19Versi3Id: element['laporan_Covid19_Versi3_Id'],
                        noRM: element['no_rm'],
                        terapi: {
                            terapiId: element['obat_id'],
                            terapiNama: element['obat_nama'],
                        },
                        jumlah: element['jumlah_obat']
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
                    data.terapiId,
                    data.jumlahTerapi,
                    data.laporanCovid19Versi3Id
                ]

                const sqlInsert = 'INSERT INTO covid.t_obat_covid ' +
                    '(covid.t_obat_covid.kodeobat,covid.t_obat_covid.jumlah_obat,covid.t_obat_covid.id_trans) ' +
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
        const laporanCovid19Versi3TerapiId = parseInt(id)
        
        const sqlValue = [
            data.terapiId,
            data.jumlahTerapi,
            laporanCovid19Versi3TerapiId,
            data.kodeRS
        ]

        const sql = 'UPDATE covid.t_obat_covid ' +
            'INNER JOIN covid.covid_v3 ON covid.covid_v3.id_trans = covid.t_obat_covid.id_trans ' +
            'SET ' +
            'covid.t_obat_covid.kodeobat=?, ' +
            'covid.t_obat_covid.jumlah_obat=? ' +
        'WHERE covid.t_obat_covid.id_t_obat = ? AND covid.covid_v3.koders = ?'

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

module.exports = LaporanCovid19Versi3Obat