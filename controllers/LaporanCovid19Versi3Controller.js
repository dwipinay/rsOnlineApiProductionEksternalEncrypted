const kematian = require('../models/Kematian')
const pagination = require('../configs/Pagination')
const laporanCovid19Versi3 = require('../models/LaporanCovid19Versi3')
const moment = require('moment')
const Joi = require('joi')

class LaporanCovid19Versi3Controller {
    index(req, res) {
        const laporanCovid19Versi3Object = new laporanCovid19Versi3()
        laporanCovid19Versi3Object.getData(req, (err, results) => {
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
        const laporanCovid19Versi3Object = new laporanCovid19Versi3()
        laporanCovid19Versi3Object.show(req.user, req.params.id, (err, results) => {
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
            kewarganegaraanId: Joi.string().required(),
            nik: Joi.string().required(),
            noPassport: Joi.string().required().allow(null),
            asalPasienId: Joi.number().required(),
            noRM: Joi.string().required(),
            namaLengkapPasien: Joi.string().required(),
            namaInisialPasien: Joi.string().required(),
            tanggalLahir: Joi.string().required(),
            email: Joi.string().allow(null),
            noTelp: Joi.string().required(),
            jenisKelaminId: Joi.string().required(),
            domisiliKecamatanId : Joi.number().required(),
            domisiliKabKotaId: Joi.number().required(),
            domisiliProvinsiId: Joi.number().required(),
            pekerjaanId: Joi.number().required(),
            tanggalMasuk: Joi.string().required(),
            jenisPasienId: Joi.number().required(),
            varianCovidId: Joi.number().required(),
            statusPasienId: Joi.number().required(),
            statusCoInsidenId: Joi.number().required(),
            statusRawatId: Joi.number().required(),
            alatOksigenId: Joi.number().required().allow(null),
            penyintasId: Joi.number().required(),
            tanggalOnsetGejala: Joi.string().required(),
            kelompokGejalaId: Joi.number().required(),
            gejala: Joi.object().keys({
                demamId: Joi.number().required(),
                batukId: Joi.number().required(),
                pilekId: Joi.number().required(),
                sakitTenggorokanId: Joi.number().required(),
                sesakNapasId: Joi.number().required(),
                lemasId: Joi.number().required(),
                nyeriOtotId: Joi.number().required(),
                mualMuntahId: Joi.number().required(),
                diareId: Joi.number().required(),
                anosmiaId: Joi.number().required(),
                napasCepatId: Joi.number().required(),
                frekNapas30KaliPerMenitId: Joi.number().required(),
                distresPernapasanBeratId: Joi.number().required(),
                lainnyaId: Joi.number().required()
            }).required()
        })

        const { error, value } =  schema.validate(req.body)
        if (error) {
            res.status(404).send({
                status: false,
                message: error.details[0].message
            })
            return
        }

        let dateObject = new Date()

        let tanggal = ("0" + dateObject.getDate()).slice(-2);
        let bulan = ("0" + (dateObject.getMonth() + 1)).slice(-2);
        let tahun = dateObject.getFullYear();

        let today = moment(tahun + "-" + bulan + "-" + tanggal, 'YYYY-MM-DD') 

        let tanggalLahir = moment(req.body.tanggalLahir, 'YYYY-MM-DD')
        let umur = today.diff(tanggalLahir, 'years')
        let umurHari = today.diff(tanggalLahir, 'days')
        let pengelompokanUmur = null
        
        let tanggalMasuk = moment(req.body.tanggaMasuk, 'YYYY-MM-DD')
        let masaRawatHari = today.diff(tanggalMasuk, 'days')

        if (umurHari < 0) {
            res.status(422).send({
                status: false,
                message: 'umur tidak diijinkan melebihi tanggal hari ini'
            })
            return
        }

        if (masaRawatHari < 0) {
            res.status(422).send({
                status: false,
                message: 'tanggal masuk tidak diijinkan melebihi tanggal hari ini'
            })
            return
        }

        switch(true) {
            case (umur < 11):
                pengelompokanUmur = 1
                break
            case (umur < 21):
                pengelompokanUmur = 2
                break
            case (umur < 31):
                pengelompokanUmur = 3
                break
            case (umur < 41):
                pengelompokanUmur = 4
                break
            case (umur < 51):
                pengelompokanUmur = 5
                break
            case (umur < 61):
                pengelompokanUmur = 6
                break
            case (umur < 71):
                pengelompokanUmur = 7
                break
            case (umur < 81):
                pengelompokanUmur = 8
                break
            case (umur < 101):
                pengelompokanUmur = 9
                break
        }

        let pengelompokanKewarganegaraan = null
        switch(true) {
            case (req.body.kewarganegaraanId == 'ID'):
                pengelompokanKewarganegaraan = 1
                break
            default:
                pengelompokanKewarganegaraan = 2
                break
        }

        let pengelompokanSaturasiOksigen = null
        let severityLevelId = null
        if (req.body.kelompokGejalaId == 1) {
            pengelompokanSaturasiOksigen = '>= 95'
            severityLevelId = 4
            if (req.body.alatOksigenId != null) {
                res.status(422).send({
                    status: false,
                    message: `Hanya null alatOksigenId yang diijinkan untuk kelompokGejalaId ${req.body.kelompokGejalaId }`
                })
                return
            }
            
        } else if (req.body.kelompokGejalaId == 2) {
            pengelompokanSaturasiOksigen = '>= 95'
            severityLevelId = 1
            if (req.body.alatOksigenId != null) {
                res.status(422).send({
                    status: false,
                    message: `Hanya null alatOksigenId yang diijinkan untuk kelompokGejalaId ${req.body.kelompokGejalaId }`
                })
                return
            }
        } else if (req.body.kelompokGejalaId == 3) {
            pengelompokanSaturasiOksigen = '>= 93'
            severityLevelId = 2
            let alatOksigen = [1,2]
            if (alatOksigen.indexOf(parseInt(req.body.alatOksigenId)) < 0) {
                res.status(422).send({
                    status: false,
                    message: `alatOksigenId ${req.body.alatOksigenId} tidak diijinkan untuk kelompokGejalaId ${req.body.kelompokGejalaId }`
                })
                return
            }
        } else if (req.body.kelompokGejalaId == 4) {
            pengelompokanSaturasiOksigen = '< 93'   
            severityLevelId = 3
            let alatOksigen = [2,3,4,5]
            if (alatOksigen.indexOf(parseInt(req.body.alatOksigenId)) < 0) {
                res.status(422).send({
                    status: false,
                    message: `alatOksigenId ${req.body.alatOksigenId} tidak diijinkan untuk kelompokGejalaId ${req.body.kelompokGejalaId }`
                })
                return
            }
        } else {
            res.status(422).send({
                status: false,
                message: 'nilai kelompokGejalaId tersebut tidak diijinkan'
            })
            return
        }

        let gejala = null
        if (req.body.kelompokGejalaId == 1) {
            gejala = {
                demamId: 0,
                batukId: 0,
                pilekId: 0,
                sakitTenggorokanId: 0,
                sesakNapasId: 0,
                lemasId: 0,
                nyeriOtotId: 0,
                mualMuntahId: 0,
                diareId: 0,
                anosmiaId: 0,
                napasCepatId: 0,
                frekNapas30KaliPerMenitId: 0,
                distresPernapasanBeratId: 0,
                lainnyaId: 0
            }
        } else if (req.body.kelompokGejalaId == 2) {
            gejala = {
                demamId: req.body.gejala.demamId,
                batukId: req.body.gejala.batukId,
                pilekId: req.body.gejala.pilekId,
                sakitTenggorokanId: req.body.gejala.sakitTenggorokanId,
                sesakNapasId: 0,
                lemasId: req.body.gejala.lemasId,
                nyeriOtotId: req.body.gejala.nyeriOtotId,
                mualMuntahId: req.body.gejala.mualMuntahId,
                diareId: req.body.gejala.diareId,
                anosmiaId: req.body.gejala.anosmiaId,
                napasCepatId: 1,
                frekNapas30KaliPerMenitId: 0,
                distresPernapasanBeratId: 0,
                lainnyaId: req.body.gejala.lainnyaId
            }
        } else if (req.body.kelompokGejalaId == 3) {
            gejala = {
                demamId: req.body.gejala.demamId,
                batukId: req.body.gejala.batukId,
                pilekId: req.body.gejala.pilekId,
                sakitTenggorokanId: req.body.gejala.sakitTenggorokanId,
                sesakNapasId: 1,
                lemasId: req.body.gejala.lemasId,
                nyeriOtotId: req.body.gejala.nyeriOtotId,
                mualMuntahId: req.body.gejala.mualMuntahId,
                diareId: req.body.gejala.diareId,
                anosmiaId: req.body.gejala.anosmiaId,
                napasCepatId: req.body.gejala.napasCepatId,
                frekNapas30KaliPerMenitId: req.body.gejala.frekNapas30KaliPerMenitId,
                distresPernapasanBeratId: req.body.gejala.distresPernapasanBeratId,
                lainnyaId: req.body.gejala.lainnyaId
            }
        } else if (req.body.kelompokGejalaId == 4) {
            gejala = {
                demamId: req.body.gejala.demamId,
                batukId: req.body.gejala.batukId,
                pilekId: req.body.gejala.pilekId,
                sakitTenggorokanId: req.body.gejala.sakitTenggorokanId,
                sesakNapasId: 1,
                lemasId: req.body.gejala.lemasId,
                nyeriOtotId: req.body.gejala.nyeriOtotId,
                mualMuntahId: req.body.gejala.mualMuntahId,
                diareId: req.body.gejala.diareId,
                anosmiaId: req.body.gejala.anosmiaId,
                napasCepatId: 0,
                frekNapas30KaliPerMenitId: 1,
                distresPernapasanBeratId: 1,
                lainnyaId: req.body.gejala.lainnyaId
            }
        }

        let terapiOksigenId = null
        if (req.body.alatOksigenId == null) {
            terapiOksigenId = 0
        } else { terapiOksigenId = 1 }


        const data = {
            kewarganegaraanId: req.body.kewarganegaraanId,
            nik: req.body.nik,
            noPassport: req.body.noPassport,
            asalPasienId: req.body.asalPasienId,
            kodeRS: req.user.kode_rs,
            noRM: req.body.noRM,
            namaLengkapPasien: req.body.namaLengkapPasien,
            namaInisialPasien: req.body.namaInisialPasien,
            tanggalLahir: req.body.tanggalLahir,
            pengelompokanUmur: pengelompokanUmur,
            email: req.body.email,
            noTelp: req.body.noTelp,
            jenisKelaminId: req.body.jenisKelaminId,
            domisiliKecamatanId : req.body.domisiliKecamatanId,
            domisiliKabKotaId: req.body.domisiliKabKotaId,
            domisiliProvinsiId: req.body.domisiliProvinsiId,
            pekerjaanId: req.body.pekerjaanId,
            tanggalMasuk: req.body.tanggalMasuk,
            jenisPasienId: req.body.jenisPasienId,
            varianCovidId: req.body.varianCovidId,
            statusRawatId: req.body.statusPasienId,
            severityLevelId: severityLevelId,
            statusCoInsidenId: req.body.statusCoInsidenId,
            statusIsolasiId: req.body.statusRawatId,
            saturasiOksigen: pengelompokanSaturasiOksigen,
            terapiOksigenId: terapiOksigenId,
            alatOksigenId: req.body.alatOksigenId,
            ipConsumer: req.socket.remoteAddress.toString().replace('::ffff:', ''),
            pengelompokanKewarganegaraan: pengelompokanKewarganegaraan,
            penyintasId: req.body.penyintasId,
            tanggalOnsetGejala: req.body.tanggalOnsetGejala,
            kelompokGejalaId: req.body.kelompokGejalaId,
            gejala: gejala
        }
        
        const laporanCovid19Versi3Object = new laporanCovid19Versi3()
        laporanCovid19Versi3Object.insertDataEncripted(data, (err, result) => {
            if (err) {
                res.status(422).send({
                    status: false,
                    message: err.sqlMessage
                })
                return
            } else if (result == 1) {
                res.status(422).send({
                    status: false,
                    message: "Pasien dengan NIK tersebut masih dalam perawatan"
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
            kewarganegaraanId: Joi.string().required(),
            nik: Joi.string().required(),
            noPassport: Joi.string().required().allow(null),
            asalPasienId: Joi.number().required(),
            noRM: Joi.string().required(),
            namaLengkapPasien: Joi.string().required(),
            namaInisialPasien: Joi.string().required(),
            tanggalLahir: Joi.string().required(),
            email: Joi.string().allow(null),
            noTelp: Joi.string().required(),
            jenisKelaminId: Joi.string().required(),
            domisiliKecamatanId : Joi.number().required(),
            domisiliKabKotaId: Joi.number().required(),
            domisiliProvinsiId: Joi.number().required(),
            pekerjaanId: Joi.number().required(),
            tanggalMasuk: Joi.string().required(),
            jenisPasienId: Joi.number().required(),
            varianCovidId: Joi.number().required(),
            statusPasienId: Joi.number().required(),
            statusCoInsidenId: Joi.number().required(),
            statusRawatId: Joi.number().required(),
            alatOksigenId: Joi.number().required().allow(null),
            penyintasId: Joi.number().required(),
            tanggalOnsetGejala: Joi.string().required(),
            kelompokGejalaId: Joi.number().required(),
            gejala: Joi.object().keys({
                demamId: Joi.number().required(),
                batukId: Joi.number().required(),
                pilekId: Joi.number().required(),
                sakitTenggorokanId: Joi.number().required(),
                sesakNapasId: Joi.number().required(),
                lemasId: Joi.number().required(),
                nyeriOtotId: Joi.number().required(),
                mualMuntahId: Joi.number().required(),
                diareId: Joi.number().required(),
                anosmiaId: Joi.number().required(),
                napasCepatId: Joi.number().required(),
                frekNapas30KaliPerMenitId: Joi.number().required(),
                distresPernapasanBeratId: Joi.number().required(),
                lainnyaId: Joi.number().required()
            }).required()
        })

        const { error, value } =  schema.validate(req.body)
        if (error) {
            res.status(404).send({
                status: false,
                message: error.details[0].message
            })
            return
        }

        let dateObject = new Date()

        let tanggal = ("0" + dateObject.getDate()).slice(-2);
        let bulan = ("0" + (dateObject.getMonth() + 1)).slice(-2);
        let tahun = dateObject.getFullYear();

        let today = moment(tahun + "-" + bulan + "-" + tanggal, 'YYYY-MM-DD') 

        let tanggalLahir = moment(req.body.tanggalLahir, 'YYYY-MM-DD')
        let umur = today.diff(tanggalLahir, 'years')
        let umurHari = today.diff(tanggalLahir, 'days')
        let pengelompokanUmur = null
        
        let tanggalMasuk = moment(req.body.tanggaMasuk, 'YYYY-MM-DD')
        let masaRawatHari = today.diff(tanggalMasuk, 'days')

        if (umurHari < 0) {
            res.status(422).send({
                status: false,
                message: 'umur tidak diijinkan melebihi tanggal hari ini'
            })
            return
        }

        if (masaRawatHari < 0) {
            res.status(422).send({
                status: false,
                message: 'tanggal masuk tidak diijinkan melebihi tanggal hari ini'
            })
            return
        }

        switch(true) {
            case (umur < 11):
                pengelompokanUmur = 1
                break
            case (umur < 21):
                pengelompokanUmur = 2
                break
            case (umur < 31):
                pengelompokanUmur = 3
                break
            case (umur < 41):
                pengelompokanUmur = 4
                break
            case (umur < 51):
                pengelompokanUmur = 5
                break
            case (umur < 61):
                pengelompokanUmur = 6
                break
            case (umur < 71):
                pengelompokanUmur = 7
                break
            case (umur < 81):
                pengelompokanUmur = 8
                break
            case (umur < 101):
                pengelompokanUmur = 9
                break
        }

        let pengelompokanKewarganegaraan = null
        switch(true) {
            case (req.body.kewarganegaraanId == 'ID'):
                pengelompokanKewarganegaraan = 1
                break
            default:
                pengelompokanKewarganegaraan = 2
                break
        }

        let pengelompokanSaturasiOksigen = null
        let severityLevelId = null
        if (req.body.kelompokGejalaId == 1) {
            pengelompokanSaturasiOksigen = '>= 95'
            severityLevelId = 4
            if (req.body.alatOksigenId != null) {
                res.status(422).send({
                    status: false,
                    message: `Hanya null alatOksigenId yang diijinkan untuk kelompokGejalaId ${req.body.kelompokGejalaId }`
                })
                return
            }
            
        } else if (req.body.kelompokGejalaId == 2) {
            pengelompokanSaturasiOksigen = '>= 95'
            severityLevelId = 1
            if (req.body.alatOksigenId != null) {
                res.status(422).send({
                    status: false,
                    message: `Hanya null alatOksigenId yang diijinkan untuk kelompokGejalaId ${req.body.kelompokGejalaId }`
                })
                return
            }
        } else if (req.body.kelompokGejalaId == 3) {
            pengelompokanSaturasiOksigen = '>= 93'
            severityLevelId = 2
            let alatOksigen = [1,2]
            if (alatOksigen.indexOf(parseInt(req.body.alatOksigenId)) < 0) {
                res.status(422).send({
                    status: false,
                    message: `alatOksigenId ${req.body.alatOksigenId} tidak diijinkan untuk kelompokGejalaId ${req.body.kelompokGejalaId }`
                })
                return
            }
        } else if (req.body.kelompokGejalaId == 4) {
            pengelompokanSaturasiOksigen = '< 93'   
            severityLevelId = 3
            let alatOksigen = [2,3,4,5]
            if (alatOksigen.indexOf(parseInt(req.body.alatOksigenId)) < 0) {
                res.status(422).send({
                    status: false,
                    message: `alatOksigenId ${req.body.alatOksigenId} tidak diijinkan untuk kelompokGejalaId ${req.body.kelompokGejalaId }`
                })
                return
            }
        } else {
            res.status(422).send({
                status: false,
                message: 'nilai kelompokGejalaId tersebut tidak diijinkan'
            })
            return
        }

        let gejala = null
        if (req.body.kelompokGejalaId == 1) {
            gejala = {
                demamId: 0,
                batukId: 0,
                pilekId: 0,
                sakitTenggorokanId: 0,
                sesakNapasId: 0,
                lemasId: 0,
                nyeriOtotId: 0,
                mualMuntahId: 0,
                diareId: 0,
                anosmiaId: 0,
                napasCepatId: 0,
                frekNapas30KaliPerMenitId: 0,
                distresPernapasanBeratId: 0,
                lainnyaId: 0
            }
        } else if (req.body.kelompokGejalaId == 2) {
            gejala = {
                demamId: req.body.gejala.demamId,
                batukId: req.body.gejala.batukId,
                pilekId: req.body.gejala.pilekId,
                sakitTenggorokanId: req.body.gejala.sakitTenggorokanId,
                sesakNapasId: 0,
                lemasId: req.body.gejala.lemasId,
                nyeriOtotId: req.body.gejala.nyeriOtotId,
                mualMuntahId: req.body.gejala.mualMuntahId,
                diareId: req.body.gejala.diareId,
                anosmiaId: req.body.gejala.anosmiaId,
                napasCepatId: 1,
                frekNapas30KaliPerMenitId: 0,
                distresPernapasanBeratId: 0,
                lainnyaId: req.body.gejala.lainnyaId
            }
        } else if (req.body.kelompokGejalaId == 3) {
            gejala = {
                demamId: req.body.gejala.demamId,
                batukId: req.body.gejala.batukId,
                pilekId: req.body.gejala.pilekId,
                sakitTenggorokanId: req.body.gejala.sakitTenggorokanId,
                sesakNapasId: 1,
                lemasId: req.body.gejala.lemasId,
                nyeriOtotId: req.body.gejala.nyeriOtotId,
                mualMuntahId: req.body.gejala.mualMuntahId,
                diareId: req.body.gejala.diareId,
                anosmiaId: req.body.gejala.anosmiaId,
                napasCepatId: req.body.gejala.napasCepatId,
                frekNapas30KaliPerMenitId: req.body.gejala.frekNapas30KaliPerMenitId,
                distresPernapasanBeratId: req.body.gejala.distresPernapasanBeratId,
                lainnyaId: req.body.gejala.lainnyaId
            }
        } else if (req.body.kelompokGejalaId == 4) {
            gejala = {
                demamId: req.body.gejala.demamId,
                batukId: req.body.gejala.batukId,
                pilekId: req.body.gejala.pilekId,
                sakitTenggorokanId: req.body.gejala.sakitTenggorokanId,
                sesakNapasId: 1,
                lemasId: req.body.gejala.lemasId,
                nyeriOtotId: req.body.gejala.nyeriOtotId,
                mualMuntahId: req.body.gejala.mualMuntahId,
                diareId: req.body.gejala.diareId,
                anosmiaId: req.body.gejala.anosmiaId,
                napasCepatId: 0,
                frekNapas30KaliPerMenitId: 1,
                distresPernapasanBeratId: 1,
                lainnyaId: req.body.gejala.lainnyaId
            }
        }

        let terapiOksigenId = null
        if (req.body.alatOksigenId == null) {
            terapiOksigenId = 0
        } else { terapiOksigenId = 1 }


        const data = {
            kewarganegaraanId: req.body.kewarganegaraanId,
            nik: req.body.nik,
            noPassport: req.body.noPassport,
            asalPasienId: req.body.asalPasienId,
            kodeRS: req.user.kode_rs,
            noRM: req.body.noRM,
            namaLengkapPasien: req.body.namaLengkapPasien,
            namaInisialPasien: req.body.namaInisialPasien,
            tanggalLahir: req.body.tanggalLahir,
            pengelompokanUmur: pengelompokanUmur,
            email: req.body.email,
            noTelp: req.body.noTelp,
            jenisKelaminId: req.body.jenisKelaminId,
            domisiliKecamatanId : req.body.domisiliKecamatanId,
            domisiliKabKotaId: req.body.domisiliKabKotaId,
            domisiliProvinsiId: req.body.domisiliProvinsiId,
            pekerjaanId: req.body.pekerjaanId,
            tanggalMasuk: req.body.tanggalMasuk,
            jenisPasienId: req.body.jenisPasienId,
            varianCovidId: req.body.varianCovidId,
            statusRawatId: req.body.statusPasienId,
            severityLevelId: severityLevelId,
            statusCoInsidenId: req.body.statusCoInsidenId,
            statusIsolasiId: req.body.statusRawatId,
            saturasiOksigen: pengelompokanSaturasiOksigen,
            terapiOksigenId: terapiOksigenId,
            alatOksigenId: req.body.alatOksigenId,
            ipConsumer: req.socket.remoteAddress.toString().replace('::ffff:', ''),
            pengelompokanKewarganegaraan: pengelompokanKewarganegaraan,
            penyintasId: req.body.penyintasId,
            tanggalOnsetGejala: req.body.tanggalOnsetGejala,
            kelompokGejalaId: req.body.kelompokGejalaId,
            gejala: gejala
        }
        
        const laporanCovid19Versi3Object = new laporanCovid19Versi3()
        laporanCovid19Versi3Object.updateDataEncripted(data, req.params.id, (err, result) => {
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
            else if (result == 1) {
                res.status(422).send({
                    status: false,
                    message: "Pasien dengan NIK tersebut masih dalam perawatan"
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

module.exports = LaporanCovid19Versi3Controller