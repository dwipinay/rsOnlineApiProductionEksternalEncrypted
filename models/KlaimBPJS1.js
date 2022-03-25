const pool = require('../configs/pool')
const Database = require('./Database')
const dateFormat = require('dateformat')

class KlaimBPJS {
    getData(req, callback) {
        const database = new Database(pool)
        const kode_rs = req.query.kode_rs || null
        const no_berkas_eklaim = req.query.no_berkas_eklaim || null

        const sqlSelect = 'SELECT db_klaim.detail_klaim.no_pengajuan, CASE ' + 
            'WHEN db_klaim.detail_klaim.jenis_pelayanan = 2 THEN "rawat jalan" ' +
            'ELSE "rawat inap" ' +
            'END as jenis_perawatan, ' + 
            'db_klaim.detail_klaim.tglmasuk as tanggal_masuk, ' +
            'db_klaim.detail_klaim.tglkeluar as tanggal_keluar, ' +
            'DATEDIFF(db_klaim.detail_klaim.tglkeluar, db_klaim.detail_klaim.tglmasuk) + 1 as lama_rawat, ' +
            'YEAR(db_klaim.detail_klaim.tglmasuk) as tahun_masuk, ' +
            'MONTH(db_klaim.detail_klaim.tglmasuk) as bulan_masuk, ' +
            'YEAR(db_klaim.detail_klaim.tglkeluar) as tahun_keluar, ' +
            'MONTH(db_klaim.detail_klaim.tglkeluar) as bulan_keluar, ' +
            'db_klaim.t_verifikasi.no_surat, ' +
            'db_klaim.t_verifikasi.tgl_ba as tanggal_surat_bahv, ' +
            'CASE ' +
            'WHEN db_klaim.detail_klaim.biaya_topup = 0 ' +
            'THEN db_klaim.detail_klaim.biaya_pengajuan + db_klaim.detail_klaim.biaya_pemulsaran ' +
            'ELSE db_klaim.detail_klaim.biaya_topup + db_klaim.detail_klaim.biaya_pemulsaran ' +
            'END as biaya_klaim, ' +
            'db_klaim.t_verifikasi.obat as nilai_obat, ' +
            'db_klaim.t_verifikasi.apd as nilai_apd '
        
        const sqlFrom = 'FROM db_klaim.detail_klaim ' +
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

        const sqlOrderBy = ' ORDER BY db_klaim.detail_klaim.no_pengajuan ASC'

        const sql = sqlSelect.concat(sqlFrom).concat(sqlFilter).concat(sqlOrderBy)

        database.query(sql, sqlFilterValue).then(
            (res) => {
                const results = []
                res.forEach(element => {
                    results.push({
                        no_pengajuan: element['no_pengajuan'],
                        no_pengajuan: element['no_pengajuan'],
                        jenis_perawatan: element['jenis_perawatan'],
                        tanggal_masuk: dateFormat(element['tanggal_masuk'], 'yyyy-mm-dd'),
                        tanggal_keluar: dateFormat(element['tanggal_keluar'], 'yyyy-mm-dd'),
                        lama_rawat: element['lama_rawat'],
                        tahun_masuk: element['tahun_masuk'],
                        bulan_masuk: element['bulan_masuk'],
                        tahun_keluar: element['tahun_keluar'],
                        bulan_keluar: element['bulan_keluar'],
                        no_surat: element['no_surat'],
                        tanggal_surat_bahv: dateFormat(element['tanggal_surat'], 'yyyy-mm-dd'),
                        biaya_klaim: element['biaya_klaim'],
                        nilai_obat: element['nilai_obat'],
                        nilai_apd: element['nilai_apd']
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

module.exports = KlaimBPJS