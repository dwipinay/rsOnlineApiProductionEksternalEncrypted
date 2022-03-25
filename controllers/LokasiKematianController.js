const lokasikematian = require('../models/LokasiKematian')

class LokasiKematianController {
    index(req, res) {
        const lokasiKematianObject = new lokasikematian()
        lokasiKematianObject.getAll(req, (err, results) => {
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

module.exports = LokasiKematianController