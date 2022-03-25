const pool = require('../configs/pool')
const Database = require('./Database')

class KlaimBPJS3 {
    getData(req, callback) {
        const database = new Database(pool)

        const sqlSelect = 'SELECT ' +
            'v.koders, (select RUMAH_SAKIT FROM db_fasyankes.data WHERE Propinsi=v.koders) namars,db.KLS_RS, ' +
            'no_berkaseklaim, nofpk, noBAHV,tgl_ba,tv.no_surat, count(v.id_det_klaim) jml_kasus, ' +
            'SUM(if(biaya_topup=0,dt.biaya_pengajuan+biaya_pemulsaran, biaya_topup+biaya_pemulsaran)) biaya_klaim, status_baru, kode_status_baru, ' +
            'MONTH(tglkeluar) bulan_layanan, YEAR(tglkeluar) tahun_layanan '
        
        const sqlFrom = 'FROM db_klaim.detail_klaim dt ' +
            'left outer join db_klaim.t_verifikasi_detail_klaim v ON v.id_det_klaim=dt.id_det_klaim ' +
            'left outer join db_klaim.t_verifikasi tv On tv.no_bahv=v.noBAHV ' +
            'left join db_fasyankes.data db ON db.Propinsi=v.koders '
        
        const sqlWhere = 'WHERE tv.no_surat = ?'

        const sqlGroupBy = 'GROUP BY v.kode_status_baru'

        const sqlFilterValue = [req.query.no_surat]

        const sql = sqlSelect.concat(sqlFrom).concat(sqlWhere).concat(sqlGroupBy)

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

module.exports = KlaimBPJS3