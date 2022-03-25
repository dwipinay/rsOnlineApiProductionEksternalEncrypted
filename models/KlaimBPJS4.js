const pool = require('../configs/pool')
const Database = require('./Database')

class KlaimBPJS4 {
    getData(req, callback) {
        const database = new Database(pool)

        const sqlSelect = 'SELECT ' +
            'tv.no_surat, tv.no_bahv, tv.tgl_ba, ' +
            'if((select SUM(po.subtotal) from db_klaim.p_apd_obat po where po.bahv=tv.no_bahv) is null, ' +
            '(tv.apd+tv.obat),(select SUM(po.subtotal) from db_klaim.p_apd_obat po ' +
            'where po.bahv=tv.no_bahv)) apdobat, tv.tgl_sinkronisasi '
        
        const sqlFrom = 'FROM ' +
            'db_klaim.t_verifikasi tv '
        
        const sqlWhere = 'WHERE tv.no_surat = ?'


        const sqlFilterValue = [req.query.no_surat]

        const sql = sqlSelect.concat(sqlFrom).concat(sqlWhere)

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

module.exports = KlaimBPJS4