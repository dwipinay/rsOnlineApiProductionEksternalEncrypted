const statusPasienSaatMeninggal = require('../models/StatusPasienSaatMeninggal')

class StatusPasienSaatMeninggalController {
    index(req, res) {
        const statusPasienSaatMeninggalObject = new statusPasienSaatMeninggal()
        statusPasienSaatMeninggalObject.getAll(req, (err, results) => {
            if (err) {
                res.status(422).send({
                    status: false,
                    message: err
                })
                return
            }
            res.status(200).send({
                status: true,
                message: "data found",
                data: results
            })
        })
    }
}

module.exports = StatusPasienSaatMeninggalController