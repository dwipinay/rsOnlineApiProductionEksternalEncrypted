const Joi = require('joi')
const klaim = require('../models/KlaimBPJS1')
const pagination = require('../configs/Pagination')

class KlaimBPJS1Controller {
    index(req, res) {
        const schema = Joi.object({
            kode_rs: Joi.string().required(),
            no_berkas_eklaim: Joi.string().required()
        })

        const { error, value } =  schema.validate(req.query)

        if (error) {
            res.status(400).send({
                status: false,
                message: error.details[0].message
            })
            return
        }

        const klaimObject = new klaim()
        klaimObject.getData(req, (err, results) => {
            if (err) {
                res.status(422).send({
                    status: false,
                    message: err
                })
                return
            }
            
            const page = parseInt(req.query.page) || 1
            const limit = parseInt(req.query.limit) > 100 ? 100 : parseInt(req.query.limit) || 1000
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

module.exports = KlaimBPJS1Controller