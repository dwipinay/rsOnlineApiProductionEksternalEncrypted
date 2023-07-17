const ketersediaanNakes = require('../models/KetersediaanNakes')
const pagination = require('../configs/Pagination')
const Joi = require('joi')

class KetersediaanAlkes {
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
        
        const ketersediaanNakesObject = new ketersediaanNakes()
        ketersediaanNakesObject.getData(req, (err, results) => {
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

    store(req, res) {
        const schema = Joi.object({
            pekerjaan_id: Joi.number().required(),
            biodata_id: Joi.number().required(),
            kode_rs: Joi.string().required(),
            nama: Joi.string().required(),
            nik: Joi.string().required(),
            no_str: Joi.string().required().allow('').allow(null),
            no_sip: Joi.string().required().allow('').allow(null),
            jenis_nakes_id: Joi.number().required(),
            jenis_nakes_nama: Joi.string().required(),
            sub_kategori_nakes_id: Joi.number().required().allow(null),
            sub_kategori_nakes_nama: Joi.string().required().allow(null)
        });

        const { error, value } =  schema.validate(req.body)
        if (error) {
            res.status(404).send({
                status: false,
                message: error.details[0].message
            })
            return
        }
        
        const data = {
            pekerjaan_id: req.body.pekerjaan_id,
            biodata_id: req.body.biodata_id,
            kode_rs: req.body.kode_rs,
            nama: req.body.nama,
            nik: req.body.nik,
            no_str: req.body.no_str,
            no_sip: req.body.no_sip,
            jenis_nakes_id: req.body.jenis_nakes_id,
            jenis_nakes_nama: req.body.jenis_nakes_nama,
            sub_kategori_nakes_id: req.body.sub_kategori_nakes_id,
            sub_kategori_nakes_nama: req.body.sub_kategori_nakes_nama
        }

        const ketersediaanNakesObject = new ketersediaanNakes()
        ketersediaanNakesObject.insertData(data, (err, result) => {
            if (err) {
                res.status(422).send({
                    status: false,
                    message: err.sqlMessage
                })
                return
            }
            res.status(201).send({
                status: true,
                message: "data inserted successfully",
                data: result
            })
        })
        
    }

    update(req, res) {
        const schema = Joi.object({
            biodata_id: Joi.number().required(),
            nama: Joi.string().required(),
            nik: Joi.string().required(),
            no_str: Joi.string().required().allow('').allow(null),
            no_sip: Joi.string().required().allow('').allow(null),
            jenis_nakes_id: Joi.number().required(),
            jenis_nakes_nama: Joi.string().required(),
            sub_kategori_nakes_id: Joi.number().required().allow(null),
            sub_kategori_nakes_nama: Joi.string().required().allow(null),
            is_active: Joi.number().required()
        });

        const { error, value } =  schema.validate(req.body)
        if (error) {
            res.status(404).send({
                status: false,
                message: error.details[0].message
            })
            return
        }

        const data = {
            biodata_id: req.body.biodata_id,
            nama: req.body.nama,
            nik: req.body.nik,
            no_str: req.body.no_str,
            no_sip: req.body.no_sip,
            jenis_nakes_id: req.body.jenis_nakes_id,
            jenis_nakes_nama: req.body.jenis_nakes_nama,
            sub_kategori_nakes_id: req.body.sub_kategori_nakes_id,
            sub_kategori_nakes_nama: req.body.sub_kategori_nakes_nama,
            is_active: req.body.is_active
        }

        const ketersediaanNakesObject = new ketersediaanNakes()
        ketersediaanNakesObject.updateData(data, req.params.id, (err, result) => {
            if (err) {
                res.status(422).send({
                    status: false,
                    message: err
                })
                return
            }
            if (result == 'row not matched') {
                res.status(404).send({
                    status: false,
                    message: 'data not found'
                })
                return
            }
            res.status(200).send({
                status: true,
                message: "data updated successfully",
                data: result
            })
        })
    }

    delete(req, res) {
        const ketersediaanNakesObject = new ketersediaanNakes()
        ketersediaanNakesObject.softDeleteData(req.params.id, (err, result) => {
            if (err) {
                res.status(422).send({
                    status: false,
                    message: err
                })
                return
            }
            if (result == 'row not matched') {
                res.status(404).send({
                    status: false,
                    message: 'data not found'
                })
                return
            }
            res.status(200).send({
                status: true,
                message: "data deleted successfully",
                data: result
            })
        })
    }

}

module.exports = KetersediaanAlkes