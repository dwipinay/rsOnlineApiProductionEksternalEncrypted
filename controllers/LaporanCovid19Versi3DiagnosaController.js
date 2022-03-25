const kematian = require('../models/Kematian')
const pagination = require('../configs/Pagination')
const LaporanCovid19Versi3Diagnosa = require('../models/LaporanCovid19Versi3Diagnosa')
const moment = require('moment')
const Joi = require('joi')

class LaporanCovid19Versi3DiagnosaController {
    index(req, res) {
        const laporanCovid19Versi3DiagnosaObject = new LaporanCovid19Versi3Diagnosa()
        laporanCovid19Versi3DiagnosaObject.getData(req, (err, results) => {
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
        const laporanCovid19Versi3DiagnosaObject = new LaporanCovid19Versi3Diagnosa()
        laporanCovid19Versi3DiagnosaObject.show(req.user, req.params.id, (err, results) => {
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
            diagnosaId: Joi.string().required(),
            diagnosaLevelId: Joi.number().required()
        })

        const { error, value } =  schema.validate(req.body)
        if (error) {
            res.status(404).send({
                status: false,
                message: error.details[0].message
            })
            return
        }

        const icdDiagnosaUtama = ['B34.2','P96.8','Z03.8','U07.1','U07.2']
        let indexICDDiagnosaUtama = icdDiagnosaUtama.indexOf(req.body.diagnosaId)
        
        if (req.body.diagnosaLevelId == 1 && indexICDDiagnosaUtama == -1) {
            res.status(401).send({
                status: false,
                message: `${req.body.diagnosaId} tidak diijinkan untuk diagnosaLevelId 1`
            })
            return
        } 
        
        const data = {
            laporanCovid19Versi3Id: req.body.laporanCovid19Versi3Id,
            diagnosaId: req.body.diagnosaId,
            diagnosaLevelId: req.body.diagnosaLevelId,
            kodeRS: req.user.kode_rs
        }

        const laporanCovid19Versi3DiagnosaObject = new LaporanCovid19Versi3Diagnosa()
        laporanCovid19Versi3DiagnosaObject.insertData(data, (err, result) => {
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
            diagnosaId: Joi.string().required(),
            diagnosaLevelId: Joi.number().required()
        })

        const { error, value } =  schema.validate(req.body)
        if (error) {
            res.status(404).send({
                status: false,
                message: error.details[0].message
            })
            return
        }

        const icdDiagnosaUtama = ['B34.2','P96.8','Z03.8','U07.1','U07.2']
        let indexICDDiagnosaUtama = icdDiagnosaUtama.indexOf(req.body.diagnosaId)
        
        if (req.body.diagnosaLevelId == 1 && indexICDDiagnosaUtama == -1) {
            res.status(401).send({
                status: false,
                message: `${req.body.diagnosaId} tidak diijinkan untuk diagnosaLevelId 1`
            })
            return
        }

        const data = {
            diagnosaId: req.body.diagnosaId,
            diagnosaLevelId: req.body.diagnosaLevelId,
            kodeRS: req.user.kode_rs
        }
        
        const laporanCovid19Versi3DiagnosaObject = new LaporanCovid19Versi3Diagnosa()
        laporanCovid19Versi3DiagnosaObject.updateData(data, req.params.id, (err, result) => {
            if (err) {
                res.status(422).send({
                    status: false,
                    message: err
                })
                return
            }
            if (result == 'no row matched') {
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
}

module.exports = LaporanCovid19Versi3DiagnosaController