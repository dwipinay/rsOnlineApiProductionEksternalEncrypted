const pool = require('../configs/pool')
const Database = require('./Database')
const dateFormat = require('dateformat')
const axios = require('axios');

class LaporanCovid19Versi3Komorbid {
    getData(req, callback) {
        const database = new Database(pool)
        const sqlSelect = 'SELECT ' +
            'covid.t_komorbid_covid_v3.id_t_komorbid as id,' +
            'covid.t_komorbid_covid_v3.id_trans as laporan_Covid19_Versi3_Id,' +
            'covid.covid_v3.nomr as no_rm,' +
            'covid.t_komorbid_covid_v3.kode_icd as icd_10,' +
            'reference.icd_10.description as icd_10_description '

        const sqlFrom = 'FROM covid.t_komorbid_covid_v3 ' +
            'LEFT OUTER JOIN reference.icd_10 ON reference.icd_10.code = covid.t_komorbid_covid_v3.kode_icd ' +
            'LEFT OUTER JOIN covid.covid_v3 ON covid.covid_v3.id_trans = covid.t_komorbid_covid_v3.id_trans '
        
        const sqlOrder = 'ORDER BY covid.t_komorbid_covid_v3.id_t_komorbid'

        const sqlFilterValue = [
            req.user.kode_rs
        ]

        const sqlWhere = 'WHERE '

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
                        laporanCovid19Versi3Id: element['laporan_Covid19_Versi3_Id'],
                        noRM: element['no_rm'],
                        icd: element['icd_10'],
                        icd10Description: element['icd_10_description']
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
            'covid.t_komorbid_covid_v3.id_t_komorbid as id,' +
            'covid.t_komorbid_covid_v3.id_trans as laporan_Covid19_Versi3_Id,' +
            'covid.covid_v3.nomr as no_rm,' +
            'covid.t_komorbid_covid_v3.kode_icd as icd_10,' +
            'reference.icd_10.description as icd_10_description ' +
            'FROM covid.t_komorbid_covid_v3 ' +
                'LEFT OUTER JOIN reference.icd_10 ON reference.icd_10.code = covid.t_komorbid_covid_v3.kode_icd ' +
                'LEFT OUTER JOIN covid.covid_v3 ON covid.covid_v3.id_trans = covid.t_komorbid_covid_v3.id_trans ' +
            'WHERE covid.covid_v3.koders = ? and covid.t_komorbid_covid_v3.id_t_komorbid = ? ' +
            'ORDER BY covid.t_komorbid_covid_v3.id_t_komorbid'

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
                        icd: element['icd_10'],
                        icd10Description: element['icd_10_description']
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
                    data.komorbidId,
                    data.laporanCovid19Versi3Id
                ]

                const sqlInsert = 'INSERT INTO covid.t_komorbid_covid_v3 ' +
                    '(covid.t_komorbid_covid_v3.kode_icd, covid.t_komorbid_covid_v3.id_trans) ' +
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
        const laporanCovid19Versi3KomorbidId = parseInt(id)
        
        const sqlValue = [
            data.komorbidId,
            laporanCovid19Versi3KomorbidId,
            data.kodeRS
        ]

        const sql = 'UPDATE covid.t_komorbid_covid_v3 ' +
            'INNER JOIN covid.covid_v3 ON covid.covid_v3.id_trans = covid.t_komorbid_covid_v3.id_trans ' +
            'SET ' +
            'covid.t_komorbid_covid_v3.kode_icd=? ' +
        'WHERE covid.t_komorbid_covid_v3.id_t_komorbid = ? AND covid.covid_v3.koders = ?'

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

module.exports = LaporanCovid19Versi3Komorbid