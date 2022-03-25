const pool = require('../configs/pool')
const Database = require('./Database')

class ConsumerIPAddress {
    getData(callback) {
        const database = new Database(pool)
        const sql = 'select db_fasyankes.cons_ip_add.ip_id, db_fasyankes.cons_ip_add.ip_address, ' +
        'db_fasyankes.cons_ip_add.owner ' +
        'from db_fasyankes.cons_ip_add'
        database.query(sql).then(
            (results) => {
                callback(null, results)
            },(error) => {
                throw error
            }
        ).catch((error) => {
                callback(error, null)
            }
        )
    }

    insertData(req, callback) {
        const database = new Database(pool)
        const sql = 'INSERT INTO db_fasyankes.cons_ip_add (ip_address, owner, created_at ) ' +
            'VALUES ( ?, ?, now() )'
        const payload = [
            req.ip_address,
            req.owner
        ]
        database.query(sql, payload).then(
            (results) => {
                callback(null, results)
            },(error) => {
                throw error
            }
        ).catch((error) => {
                callback(error, null)
            }
        )
    }

    updateData(req, callback) {
        const database = new Database(pool)
        const sql = 'UPDATE db_fasyankes.cons_ip_add SET `ip_address` = ? WHERE `ip_id` = ?'
        const payload = req.ip_address
        const paramsId = req.id
        database.query(sql, [payload, paramsId]).then(
            (results) => {
                callback(null, results)
            },(error) => {
                throw error
            }
        ).catch((error) => {
                callback(error, null)
            }
        )
    }

    findByIPAddress(ipaddress, callback) {
        const database = new Database(pool)
        const sql = 'select ip_address from db_fasyankes.cons_ip_add where ip_address = ?'
        database.query(sql, ipaddress).then(
            (results) => {
                callback(null, results)
            },(error) => {
                throw error
            }
        ).catch((error) => {
                callback(error, null)
            }
        )
    }
}

module.exports = ConsumerIPAddress