const pool = require('../configs/pool')
const Database = require('./Database')

class KlaimBPJS2 {
    getData(req, callback) {
        const database = new Database(pool)
        const kode_rs = req.query.kode_rs || null
        const no_berkas_eklaim = req.query.no_berkas_eklaim || null

        const sqlSelect = 'SELECT ' +
            'YEAR(db_klaim.detail_klaim.tglkeluar) as "tahun_pelayanan", ' +
            'CASE ' +
                'WHEN db_klaim.detail_klaim.jenis_pelayanan = 2 THEN "rawat jalan" ' +
                'ELSE "rawat inap" ' +
            'END as jenis_perawatan, ' +
            'COUNT(db_klaim.detail_klaim.no_pengajuan) as "jumlah_pasien", ' +
            'SUM( ' +
                'CASE ' + 
                'WHEN db_klaim.detail_klaim.biaya_topup = 0 ' +
                    'THEN db_klaim.detail_klaim.biaya_pengajuan + db_klaim.detail_klaim.biaya_pemulsaran ' +
                'ELSE ' +
                    'db_klaim.detail_klaim.biaya_topup + db_klaim.detail_klaim.biaya_pemulsaran ' +
                'END ' +
            ') as "biaya_klaim" '
        
        const sqlFrom = 'FROM ' +
            'db_klaim.detail_klaim ' + 
            'LEFT OUTER JOIN db_klaim.t_verifikasi_detail_klaim ' +
                'ON db_klaim.t_verifikasi_detail_klaim.id_det_klaim = db_klaim.detail_klaim.id_det_klaim ' +
            'LEFT OUTER JOIN db_klaim.t_verifikasi ' +
                'ON db_klaim.t_verifikasi.no_bahv = db_klaim.t_verifikasi_detail_klaim.noBAHV '
        
        const sqlWhere = 'WHERE '

        const filter = []
        const sqlFilterValue = []

        if (kode_rs != null) {
            filter.push("db_klaim.t_verifikasi_detail_klaim.koders = ?")
            sqlFilterValue.push(kode_rs)
        }

        if (no_berkas_eklaim != null) {
            filter.push("db_klaim.t_verifikasi_detail_klaim.no_berkaseklaim = ?")
            sqlFilterValue.push(no_berkas_eklaim)
        }

        let sqlFilter = null
        filter.forEach((value, index) => {
            if (index == 0) {
                sqlFilter = sqlWhere.concat(value)
            } else if (index != 0) {
                sqlFilter = sqlFilter.concat(' and ').concat(value)
            }
        })

        const sqlGroupBy = 'GROUP BY YEAR(db_klaim.detail_klaim.tglkeluar), db_klaim.detail_klaim.jenis_pelayanan'

        const sql = sqlSelect.concat(sqlFrom).concat(sqlFilter).concat(sqlGroupBy)

        database.query(sql, sqlFilterValue).then(
            (res) => {
                callback(null, res)
            }
        ).catch((error) => {
                callback(error, null)
            }
        )
    }
}

module.exports = KlaimBPJS2