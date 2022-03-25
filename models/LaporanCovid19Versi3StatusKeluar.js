const pool = require('../configs/pool')
const Database = require('./Database')
const dateFormat = require('dateformat')
const axios = require('axios');

class LaporanCovid19Versi3StatusKeluar {
    updateData(data, callback) {
        const database = new Database(pool)
        const sqlUpdate = 'UPDATE covid.covid_v3 ' +
            'SET ' + 
                'covid.covid_v3.tglkeluar = ?, ' +
                'covid.covid_v3.status_keluar = ?, ' +
                'covid.covid_v3.id_kematian = ?, ' +
                'covid.covid_v3.penyebab = ?, ' +
                'covid.covid_v3.sebab_kematian = ?, ' +
                'covid.covid_v3.jeniskomorbid_coinsiden = ?, ' +
                'covid.covid_v3.tgl_update=now() ' +
            'WHERE covid.covid_v3.id_trans = ? AND covid.covid_v3.koders = ?'

        const sqlValue = [
            data.tanggalKeluar,
            data.statusKeluarId,
            data.statusPasienSaatMeninggalId,
            data.penyebabKematianId,
            data.penyebabKematianLangsungId,
            data.komorbidCoInsidenId,
            data.laporanCovid19Versi3Id,
            data.kodeRS
        ]

        database.query(sqlUpdate, sqlValue)
        .then(
            (res) => {
                if (res.affectedRows === 0 && res.changedRows === 0) {
                    callback(null, 'no row matched');
                    return
                }
                let resourceUpdated = {
                    id: data.laporanCovid19Versi3Id
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

module.exports = LaporanCovid19Versi3StatusKeluar