const penyebabKematian = require('../models/PenyebabKematian')
const pagination = require('../configs/Pagination')

class PenyebabKematianController {
    index(req, res) {
        const  penyebabKematianObject = new  penyebabKematian()
        penyebabKematianObject.getAll(req, (err, results) => {
            if (err) {
                res.status(422).send({
                    status: false,
                    message: err
                })
                return
            }

            const page = parseInt(req.query.page) || 1
            const limit = parseInt(req.query.limit) > 1000 ? 1000 : parseInt(req.query.limit) || 1000
            const paginationObject = new pagination(results, page, limit)
            const remarkPagination = paginationObject.getRemarkPagination()
            const dataPagination = paginationObject.getDataPagination()
            const message = dataPagination.length ? 'data found' : 'data not found'

            res.status(200).send({
                status: true,
                message: message,
                pagination: remarkPagination,
                data: dataPagination
            })

        })
    }
}

module.exports = PenyebabKematianController