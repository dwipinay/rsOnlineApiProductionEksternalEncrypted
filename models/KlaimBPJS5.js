const pool = require('../configs/pool')
const Database = require('./Database')

class KlaimBPJS5 {
    getData(req, callback) {
        const database = new Database(pool)

        const sqlSelect = 'SELECT ' +
            'id_klaim, v.koders, (select RUMAH_SAKIT FROM db_fasyankes.data WHERE Propinsi=v.koders) namars, no_pengajuan no_klaim, no_berkaseklaim, nofpk, noBAHV,tgl_ba,tv.no_surat, ' +
            'if(biaya_topup=0,dt.biaya_pengajuan+biaya_pemulsaran, biaya_topup+biaya_pemulsaran) biaya_klaim, st.status status_rawat,' +
            'tglmasuk, YEAR(tglmasuk) tahun_masuk, tglkeluar, YEAR(tglkeluar) tahun_keluar, MONTH(tgl_ba) bln_pengajuan,' +
            'if(dt.jenis_pelayanan = 2, "Rawat Jalan", "Rawat Inap") jenis_pelayanan,' +
            'v.kode_status_baru kode_status, v.status_baru status_klaim '
        
        const sqlFrom = 'FROM ' +
            'db_klaim.detail_klaim dt ' +
            'left outer join db_klaim.t_verifikasi_detail_klaim v ON v.id_det_klaim=dt.id_det_klaim ' +
            'left outer join db_klaim.t_verifikasi tv On tv.no_bahv=v.noBAHV ' +
            'left join db_klaim.status_rawat st On st.id_status_rawat= dt.status_rawat ' +
            'left join db_fasyankes.data db ON db.Propinsi=v.koders '
        
        const sqlWhere = 'WHERE v.koders= ? AND v.no_berkaseklaim = ? '

        const sqlOrderBy = 'ORDER BY no_pengajuan'


        const sqlFilterValue = [req.query.kode_rs, req.query.no_berkaseklaim]

        const sql = sqlSelect.concat(sqlFrom).concat(sqlWhere).concat(sqlOrderBy)

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

module.exports = KlaimBPJS5