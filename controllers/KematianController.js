const kematian = require('../models/Kematian')
const pagination = require('../configs/Pagination')
const penyebabKematianLangsung = require('../models/PenyebabKematianLangsung')
const Joi = require('joi')

class KematianController {
    index(req, res) {
        const kematianObject = new kematian()
        kematianObject.getAll(req.user, (err, results) => {
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

    store(req, res) {
        const schema = Joi.object({
            nik: Joi.string().required().allow(null),
            nama: Joi.string().required(),
            jenis_kelamin: Joi.string().required(),
            tanggal_lahir: Joi.string().required(),
            ktp_alamat: Joi.string().required(),
            ktp_kelurahan_id: Joi.number().required(),
            ktp_kecamatan_id: Joi.number().required(),
            ktp_kab_kota_id: Joi.number().required(),
            ktp_provinsi_id: Joi.number().required(),
            domisili_alamat: Joi.string().required(),
            tanggal_masuk: Joi.string().required(),
            saturasi_oksigen: Joi.number().required(),
            tanggal_kematian: Joi.string().required(),
            lokasi_kematian_id: Joi.number().required(),
            penyebab_kematian_langsung_id: Joi.string().required(),
            kasus_kematian_id: Joi.string().required(),
            status_komorbid: Joi.string().required(),
            komorbid_1_id: Joi.string().required().allow(null),
            komorbid_2_id: Joi.string().required().allow(null),
            komorbid_3_id: Joi.string().required().allow(null),
            komorbid_4_id: Joi.string().required().allow(null),
            status_kehamilan: Joi.string().required()
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
            nik: req.body.nik,
            nama: req.body.nama,
            jenis_kelamin: req.body.jenis_kelamin,
            tanggal_lahir: req.body.tanggal_lahir,
            ktp_alamat: req.body.ktp_alamat,
            ktp_kelurahan_id: req.body.ktp_kelurahan_id,
            ktp_kecamatan_id: req.body.ktp_kecamatan_id,
            ktp_kab_kota_id: req.body.ktp_kab_kota_id,
            ktp_provinsi_id: req.body.ktp_provinsi_id,
            domisili_alamat: req.body.domisili_alamat,
            tanggal_lahir: req.body.tanggal_lahir,
            kode_rs: req.user.kode_rs,
            tanggal_masuk: req.body.tanggal_masuk,
            saturasi_oksigen: req.body.saturasi_oksigen,
            tanggal_kematian: req.body.tanggal_kematian,
            lokasi_kematian_id: req.body.lokasi_kematian_id,
            penyebab_kematian_langsung_id: req.body.penyebab_kematian_langsung_id,
            kasus_kematian_id: req.body.kasus_kematian_id,
            status_komorbid: req.body.status_komorbid,
            komorbid_1_id: req.body.komorbid_1_id,
            komorbid_2_id: req.body.komorbid_2_id,
            komorbid_3_id: req.body.komorbid_3_id,
            komorbid_4_id: req.body.komorbid_4_id,
            status_kehamilan: req.body.status_kehamilan
        }

        const penyebabKematianLangsungObject = new penyebabKematianLangsung()
        penyebabKematianLangsungObject.findById(req.body.penyebab_kematian_langsung_id, (err, results) => {
            if (err) {
                res.status(422).send({
                    status: false,
                    message: err
                })
                return
            }
            if(!results.length) {
                const errorMessage = `kode ${req.body.penyebab_kematian_langsung_id} tidak diperbolehkan untuk penyebab kematian covid-19`
                res.status(401).send({
                    status:false,
                    message: errorMessage
                })
                return
            }
            
            const kematianObject = new kematian()
            kematianObject.insertData(data, (err, result) => {
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

        })

        // const kematianObject = new kematian()
        // kematianObject.insertData(data, (err, result) => {
        //     if (err) {
        //         res.status(422).send({
        //             status: false,
        //             message: err.sqlMessage
        //         })
        //         return
        //     }
        //     res.status(201).send({
        //         status: true,
        //         message: "data inserted successfully",
        //         data: result
        //     })
        // })
    }

    update(req, res) {
        const schema = Joi.object({
            tanggal_masuk: Joi.string().required(),
            saturasi_oksigen: Joi.number().required(),
            tanggal_kematian: Joi.string().required(),
            lokasi_kematian_id: Joi.number().required(),
            penyebab_kematian_langsung_id: Joi.string().required(),
            kasus_kematian_id: Joi.string().required(),
            status_komorbid: Joi.string().required(),
            komorbid_1_id: Joi.string().required().allow(null),
            komorbid_2_id: Joi.string().required().allow(null),
            komorbid_3_id: Joi.string().required().allow(null),
            komorbid_4_id: Joi.string().required().allow(null),
            // status_kehamilan: Joi.string().required()
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
            kode_rs: req.user.kode_rs,
            tanggal_masuk: req.body.tanggal_masuk,
            saturasi_oksigen: req.body.saturasi_oksigen,
            tanggal_kematian: req.body.tanggal_kematian,
            lokasi_kematian_id: req.body.lokasi_kematian_id,
            penyebab_kematian_langsung_id: req.body.penyebab_kematian_langsung_id,
            kasus_kematian_id: req.body.kasus_kematian_id,
            status_komorbid: req.body.status_komorbid,
            komorbid_1_id: req.body.komorbid_1_id,
            komorbid_2_id: req.body.komorbid_2_id,
            komorbid_3_id: req.body.komorbid_3_id,
            komorbid_4_id: req.body.komorbid_4_id,
            // status_kehamilan: req.body.status_kehamilan
        }
        const kematianObject = new kematian()
        kematianObject.updateData(data, req.params.id, (err, result) => {
            if (err) {
                res.status(422).send({
                    status: false,
                    message: err.sqlMessage
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

    destroy(req, res) {
        const kematianObject = new kematian()
        kematianObject.deleteData(req.user.kode_rs, req.params.id, (err, results) => {
            if (err) {
                res.status(422).send({
                    status: false,
                    message: err
                })
                return
            }
            if (results == 'no row matched') {
                res.status(404).send({
                    status: false,
                    message: 'data not found'
                })
                return
            }
            res.status(200).send({
                status: true,
                message: "data deleted successfully"
            })
        })
    }
}

module.exports = KematianController