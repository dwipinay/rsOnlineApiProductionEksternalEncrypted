const ketersediaanTempatTidur = require('../models/KetersediaanTempatTidur')
const pagination = require('../configs/Pagination')
const Joi = require('joi')

class KetersediaanTempatTidurController {
    index(req, res) {
        const schema = Joi.object({
            provinsiId: Joi.number().required(),
            kabKotaId: Joi.number(),
            page: Joi.number(),
            limit: Joi.number(),
            tanggalUpdate: Joi.string()
        })

        const { error, value } =  schema.validate(req.query)
        if (error) {
            res.status(404).send({
                status: false,
                message: error.details[0].message
            })
            return
        }

        const ketersediaanTempatTidurObject = new ketersediaanTempatTidur()
        ketersediaanTempatTidurObject.getData(req, (err, results) => {
            if (err) {
                res.status(422).send({
                    status: false,
                    message: err
                })
                return
            }

            const page = parseInt(req.query.page) || 1
            const limit = parseInt(req.query.limit) > 100 ? 10 : parseInt(req.query.limit) || 100
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

module.exports = KetersediaanTempatTidurController