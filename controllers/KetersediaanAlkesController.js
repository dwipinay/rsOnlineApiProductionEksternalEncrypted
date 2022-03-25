const ketersediaanAlkes = require('../models/KetersediaanAlkes')
const pagination = require('../configs/Pagination')
const axios = require('axios');
const Joi = require('joi')

class KetersediaanAlkesController {
    index(req, res) {
        const schema = Joi.object({
            kode_rs: Joi.string().required(),
            page: Joi.number(),
            limit: Joi.number()
        })

        const { error, value } =  schema.validate(req.query)

        if (error) {
            res.status(400).send({
                status: false,
                message: error.details[0].message
            })
            return
        }
        
        const ketersediaanAlkesObject = new ketersediaanAlkes()
        ketersediaanAlkesObject.getData(req, (err, results) => {
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

module.exports = KetersediaanAlkesController