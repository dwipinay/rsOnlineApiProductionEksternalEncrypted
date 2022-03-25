const kematian = require('../models/Kematian')
const pagination = require('../configs/Pagination')
const LaporanCovid19Versi3PemeriksaanLab = require('../models/LaporanCovid19Versi3PemeriksaanLab')
const moment = require('moment')
const Joi = require('joi')

class LaporanCovid19Versi3PemeriksaanLabController {
    index(req, res) {
        const laporanCovid19Versi3PemeriksaanLabObject = new LaporanCovid19Versi3PemeriksaanLab()
        laporanCovid19Versi3PemeriksaanLabObject.getData(req, (err, results) => {
            if (err) {
                res.status(422).send({
                    status: false,
                    message: err
                })
                return
            }
            if (results.length) {
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
            } else {
                res.status(200).send({
                    status: true,
                    message: "data not found",
                    data: results
                })
            }
        })
    }

    show(req, res) {
        const laporanCovid19Versi3PemeriksaanLabObject = new LaporanCovid19Versi3PemeriksaanLab()
        laporanCovid19Versi3PemeriksaanLabObject.show(req.user, req.params.id, (err, results) => {
            if (err) {
                res.status(422).send({
                    status: false,
                    message: err
                })
                return
            }

            const message = results.length ? 'data found' : 'data not found'
            const data = results.length ? results[0] : null

            res.status(200).send({
                status: true,
                message: message,
                data: data
            })
        })
    }

    store(req, res) {
        const schema = Joi.object({
            laporanCovid19Versi3Id: Joi.number().required(),
            jenisPemeriksaanLabId: Joi.number().required(),
            hasilPemeriksaanLabId: Joi.number().required(),
            tanggalHasilPemeriksaanLab: Joi.string().required()
        })

        const { error, value } =  schema.validate(req.body)
        if (error) {
            res.status(404).send({
                status: false,
                message: error.details[0].message
            })
            return
        }

        
        const data = {
            laporanCovid19Versi3Id: req.body.laporanCovid19Versi3Id,
            jenisPemeriksaanLabId: req.body.jenisPemeriksaanLabId,
            hasilPemeriksaanLabId: req.body.hasilPemeriksaanLabId,
            tanggalHasilPemeriksaanLab: req.body.tanggalHasilPemeriksaanLab,
            kodeRS: req.user.kode_rs
        }

        const laporanCovid19Versi3PemerisaanObject = new LaporanCovid19Versi3PemeriksaanLab()
        laporanCovid19Versi3PemerisaanObject.insertData(data, (err, result) => {
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
}

module.exports = LaporanCovid19Versi3PemeriksaanLabController