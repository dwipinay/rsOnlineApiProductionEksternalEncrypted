const pagination = require('../configs/Pagination')
const LaporanCovid19Versi3StatusKeluar = require('../models/LaporanCovid19Versi3StatusKeluar')
const moment = require('moment')
const Joi = require('joi')

class LaporanCovid19Versi3StatusKeluarController {
    store(req, res) {
        const schema = Joi.object({
            laporanCovid19Versi3Id: Joi.number().required(),
            tanggalKeluar: Joi.string().required(),
            statusKeluarId: Joi.number().required(),
            penyebabKematianId: Joi.number().required().allow(null),
            penyebabKematianLangsungId: Joi.string().required().allow(null),
            statusPasienSaatMeninggalId: Joi.number().required().allow(null),
            komorbidCoInsidenId: Joi.number().required().allow(null)
        })

        const { error, value } =  schema.validate(req.body)
        if (error) {
            res.status(404).send({
                status: false,
                message: error.details[0].message
            })
            return
        }

        let penyebabKematianId = null
        let penyebabKematianLangsungId = null
        let statusPasienSaatMeninggalId = null
        let komorbidCoInsidenId = null

        if (req.body.statusKeluarId == 2) {
            penyebabKematianId = req.body.penyebabKematianId
            penyebabKematianLangsungId = req.body.penyebabKematianLangsungId
            statusPasienSaatMeninggalId = req.body.statusPasienSaatMeninggalId
            komorbidCoInsidenId = req.body.komorbidCoInsidenId
        }
        
        const data = {
            laporanCovid19Versi3Id: req.body.laporanCovid19Versi3Id,
            tanggalKeluar: req.body.tanggalKeluar,
            statusKeluarId: req.body.statusKeluarId,
            penyebabKematianId: penyebabKematianId,
            penyebabKematianLangsungId: penyebabKematianLangsungId,
            statusPasienSaatMeninggalId: statusPasienSaatMeninggalId,
            komorbidCoInsidenId: komorbidCoInsidenId,
            kodeRS: req.user.kode_rs
        }

        // console.log(data)

        const laporanCovid19Versi3StatusKeluarObject = new LaporanCovid19Versi3StatusKeluar()
        laporanCovid19Versi3StatusKeluarObject.updateData(data, (err, result) => {
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

module.exports = LaporanCovid19Versi3StatusKeluarController