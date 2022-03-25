const pool = require('../configs/pool')
const Database = require('./Database')
const dateFormat = require('dateformat')

class KlaimKemKes {
    getData(req, callback) {
        const database = new Database(pool)
        const no_tpkd = req.query.no_tpkd || null

        const sqlSelect = 'SELECT ' +
            'db_klaim.rekap_validasi_tpkd.namars as nama_rs, ' +
            'db_klaim.rekap_validasi_tpkd.jml_kasus as jumlah_kasus, ' +
            'db_klaim.rekap_validasi_tpkd.jml_tagihan as jumlah_tagihan, ' +
            'db_klaim.rekap_validasi_tpkd.tahun_keluar, ' +
            'db_klaim.t_ba_dispute.tgl_ba_dispute tanggal_bahv '
            
        const sqlFrom = 'FROM ' +
            'db_klaim.rekap_validasi_tpkd ' +
            'LEFT JOIN db_klaim.tpkd_verif ON db_klaim.tpkd_verif.no_tpkd = db_klaim.rekap_validasi_tpkd.no_tpkd ' +
            'LEFT JOIN db_klaim.t_ba_dispute ON db_klaim.t_ba_dispute.no_ba_dispute = db_klaim.tpkd_verif.no_bast ' +
            'LEFT JOIN db_klaim.t_bahv_kemkes  ON db_klaim.t_bahv_kemkes.no_bahv_kemkes = db_klaim.rekap_validasi_tpkd.no_tpkd '
        
        const sqlWhere = 'WHERE '

        const filter = []
        const sqlFilterValue = []

        if (no_tpkd != null) {
            filter.push("db_klaim.rekap_validasi_tpkd.no_tpkd = ?")
            sqlFilterValue.push(no_tpkd)
        }


        let sqlFilter = null
        filter.forEach((value, index) => {
            if (index == 0) {
                sqlFilter = sqlWhere.concat(value)
            } else if (index != 0) {
                sqlFilter = sqlFilter.concat(' and ').concat(value)
            }
        })

        const sqlGroupBy = 'GROUP BY db_klaim.rekap_validasi_tpkd.no_tpkd'

        const sql = sqlSelect.concat(sqlFrom).concat(sqlFilter).concat(sqlGroupBy)

        database.query(sql, sqlFilterValue).then(
            (res) => {
                const results = []
                res.forEach(element => {
                    results.push({
                        jumlah_kasus: element['jumlah_kasus'],
                        jumlah_tagihan: element['jumlah_tagihan'],
                        tahun_pelayanan: element['tanggal_keluar'],
                        tanggal_bahv: dateFormat(element['tanggal_bahv'], 'yyyy-mm-dd'),
                    })
                });
                callback(null, results)
            }
        ).catch((error) => {
                callback(error, null)
            }
        )
    }
}

module.exports = KlaimKemKes