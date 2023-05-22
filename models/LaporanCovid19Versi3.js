const pool = require('../configs/pool')
const Database = require('./Database')
const dateFormat = require('dateformat')
const https = require('https')
const axios = require('axios')

class LaporanCovid19Versi3 {
    getData(req, callback) {
        const database = new Database(pool)
        const sqlSelect = 'SELECT ' +
            'covid.covid_v3.id_trans,' +
            'covid.covid_v3.nik,' +
            'covid.covid_v3.nomr as no_rm,' +
            'covid.covid_v3.initial as nama_inisial,' +
            'covid.covid_v3.nama_lengkap as nama_lengkap,' +
            'covid.covid_v3.gender as jenis_kelamin_id,' +
            'CASE ' +
                'WHEN covid.covid_v3.gender = "L" THEN "Laki-Laki"' +
                'WHEN covid.covid_v3.gender = "P" THEN "Perempuan"' +
                'ELSE "Lainnya"' +
            'END as jenis_kelamin_nama,' +
            'covid.covid_v3.birthdate as tanggal_lahir,' +
            'covid.covid_v3.email,' +
            'covid.covid_v3.notelp as no_telp,' +
            'covid.kelompokumur.kelompok_umur as kelompok_umur,' +
            'covid.covid_v3.kecamatan as domisili_kecamatan_id,' +
            'reference.kecamatan.nama as domisili_kecamatan_nama,' +
            'reference.kab_kota.id as domisili_kab_kota_id,' +
            'reference.kab_kota.nama as domisili_kab_kota_nama,' +
            'reference.provinsi.id as domisili_provinsi_id,' +
            'reference.provinsi.nama as domisili_provinsi_nama,' +
            'covid.covid_v3.tglmasuk as tanggal_masuk,' +
            'covid.covid_v3.profesi as pekerjaan_id,' +
            'covid.profesi.deskripsi as pekerjaan_nama,' +
            'covid.covid_v3.jenis_pasien as jenis_pasien_id,' +
            'covid.jenis_pasien.deskripsi as jenis_pasien_nama,' +
            'covid.covid_v3.varian as varian_covid_id, ' +
            'm_varian_covid.jenis_varian as varian_covid_nama, ' +
            'covid.covid_v3.status_rawat as status_pasien_id,' +
            'covid.status_rawat_kmk.status as status_pasien_nama ,' +
            'CASE ' +
                'WHEN covid.covid_v3.komorbid = "0" THEN "tidak"' +
                'WHEN covid.covid_v3.komorbid = "1" THEN "ya"' +
                'ELSE "null"' +
            'END as status_komorbid_nama,' +
            'covid.covid_v3.coinsiden as status_coinsiden_id,' +
            'CASE ' +
                'WHEN covid.covid_v3.coinsiden = "0" THEN "tidak"' +
                'WHEN covid.covid_v3.coinsiden = "1" THEN "ya"' +
                'ELSE "null"' +
            'END as status_coinsiden_nama,' +
            'covid.covid_v3.status_isolasi as status_rawat_id,' +
            'db_fasyankes.m_tempat_tidur.tt as status_rawat_nama,' +
            'covid.covid_v3.alatoksigen as alat_oksigen_id,' +
            'covid.m_alatoksigen.nama_alat as alat_oksigen_nama,' +
            'covid.covid_v3.saturasi as saturasi_oksigen,' +
            'covid.covid_v3.oksigen as terapi_oksigen_id,' +
            'CASE ' +
                'WHEN covid.covid_v3.oksigen = "0" THEN "tidak"' +
                'WHEN covid.covid_v3.oksigen = "1" THEN "ya"' +
                'ELSE "null"' +
            'END as terapi_oksigen_nama,' +
            'covid.covid_v3.penyintas as penyintas_id,' +
            'CASE ' +
                'WHEN covid.covid_v3.penyintas = "0" THEN "tidak"' +
                'WHEN covid.covid_v3.penyintas = "1" THEN "ya"' +
                'ELSE "null"' +
            'END as penyintas_nama,' +
            'covid.covid_v3.tgl_lapor as tanggal_lapor,' +
            'covid.covid_v3.gejala as gejala_id, ' +
            'm_gejala_covid.deskripsi_gejala as gejala_nama,' +
            'covid.covid_v3.gejala_demam,' +
            'covid.covid_v3.gejala_batuk,' +
            'covid.covid_v3.gejala_pilek,' +
            'covid.covid_v3.gejala_sakittenggorokan,' +
            'covid.covid_v3.gejala_sesak,' +
            'covid.covid_v3.gejala_lemas,' +
            'covid.covid_v3.gejala_nyeriotot,' +
            'covid.covid_v3.gejala_mual,' +
            'covid.covid_v3.gejala_diare,' +
            'covid.covid_v3.gejala_anosmia,' +
            'covid.covid_v3.napas_cepat,' +
            'covid.covid_v3.frek_napas,' +
            'covid.covid_v3.distress,' +
            'covid.covid_v3.gejala_lainnya '

        const sqlFrom = 'FROM ' +
            'covid.covid_v3 ' +
            'LEFT OUTER JOIN covid.kelompokumur ON covid.kelompokumur.id_umur = covid.covid_v3.age ' +
            'LEFT OUTER JOIN reference.kecamatan ON reference.kecamatan.id = covid.covid_v3.kecamatan ' +
            'LEFT OUTER JOIN reference.kab_kota ON reference.kab_kota.id = reference.kecamatan.kab_kota_id ' +
            'LEFT OUTER JOIN reference.provinsi ON reference.provinsi.id = reference.kab_kota.provinsi_id ' +
            'LEFT OUTER JOIN covid.profesi ON covid.profesi.id_profesi = covid.covid_v3.profesi ' +
            'LEFT OUTER JOIN covid.jenis_pasien ON covid.jenis_pasien.id_jenis_pasien = covid.covid_v3.jenis_pasien ' +
            'LEFT OUTER JOIN covid.m_varian_covid ON covid.m_varian_covid.id = covid.covid_v3.varian ' +
            'LEFT OUTER JOIN covid.status_rawat_kmk ON covid.status_rawat_kmk.id_status_rawat = covid.covid_v3.status_rawat ' +
            'LEFT OUTER JOIN covid.m_alatoksigen ON covid.m_alatoksigen.id_alat = covid.covid_v3.oksigen ' +
            'LEFT OUTER JOIN covid.m_gejala_covid ON covid.m_gejala_covid.id_gejala = covid.covid_v3.gejala ' +
            'LEFT OUTER JOIN db_fasyankes.m_tempat_tidur ON db_fasyankes.m_tempat_tidur.id_tt = covid.covid_v3.status_isolasi ' 

        const sqlFilterValue = [
            req.user.kode_rs
        ]

        const sqlWhere = 'WHERE '

        const filter = [
            'covid.covid_v3.tglkeluar = "0000-00-00"',
            'covid.covid_v3.koders = ?'
        ]

        const noRM = req.query.noRM || null
        if (noRM != null) {
            filter.push('covid.covid_v3.nomr = ?')
            sqlFilterValue.push(noRM)
        }

        let sqlFilter = ''
        filter.forEach((value, index) => {
            if (index == 0) {
                sqlFilter = sqlWhere.concat(value)
            } else if (index > 0) {
                sqlFilter = sqlFilter.concat(' AND ').concat(value)
            }
        })
        
        const sql = sqlSelect.concat(sqlFrom).concat(sqlFilter)

        database.query(sql, sqlFilterValue)
        .then(
            (res) => {
                // console.log(res)
                const results = []
                let tanggal_masuk = null
                res.forEach(element => {
                    if (element['tanggal_masuk'] == '0000-00-00') {
                        tanggal_masuk = element['tanggal_masuk']
                    } else {
                        tanggal_masuk = dateFormat(element['tanggal_masuk'],'yyyy-mm-dd')
                    }
                    results.push({
                        id: element['id_trans'],
                        noRM: element['no_rm'],
                        namaInisialPasien: element['nama_inisial'],
                        tanggalLahir: dateFormat(element['tanggal_lahir'],'yyyy-mm-dd'),
                        jenisKelamin: {
                            id: element['jenis_kelamin_id'],
                            nama: element['jenis_kelamin_nama']
                        },
                        email: element['email'],
                        domisiliAlamat: {
                            kecamatan: {
                                id: element['domisili_kecamatan_id'],
                                nama: element['domisili_kecamatan_nama']
                            },
                            kabKota: {
                                id: parseInt(element['domisili_kab_kota_id']),
                                nama: element['domisili_kab_kota_nama']
                            },
                            provinsi: {
                                id: parseInt(element['domisili_provinsi_id']),
                                nama: element['domisili_provinsi_nama']
                            }
                        },
                        noTelp: element['no_telp'],
                        tanggalMasuk: tanggal_masuk,
                        pekerjaan: {
                            id: element['pekerjaan_id'],
                            nama: element['pekerjaan_nama']
                        },
                        jenisPasien: {
                            id: element['jenis_pasien_id'],
                            nama: element['jenis_pasien_nama']
                        },
                        varianCovid: {
                            id: element['varian_covid_id'],
                            nama: element['varian_covid_nama']
                        },
                        statusPasien: {
                            id: element['status_pasien_id'],
                            nama: element['status_pasien_nama']
                        },
                        statusKomorbid: {
                            id: element['status_komorbid_id'],
                            nama: element['status_komorbid_nama']
                        },
                        statusCoInsiden: {
                            id: element['status_coinsiden_id'],
                            nama: element['status_coinsiden_nama']
                        },
                        statusRawat: {
                            id: element['status_rawat_id'],
                            nama: element['status_rawat_nama']
                        },
                        alatOksigen: {
                            id: element['alat_oksigen_id'],
                            nama: element['alat_oksigen_nama']
                        },
                        saturasiOksigen: element['saturasi_oksigen'],
                        terapiOksigen: {
                            id: element['terapi_oksigen_id'],
                            nama: element['terapi_oksigen_nama']
                        },
                        penyintas: {
                            id: element['penyintas_id'],
                            nama: element['penyintas_nama']
                        },
                        tanggalLapor: dateFormat(element['tanggal_lapor'],'yyyy-mm-dd hh:mm:ss'),
                        kelompokGejala: {
                            id: element['gejala_id'],
                            nama: element['gejala_nama']
                        },
                        gejala: 
                            {
                                demam: {
                                    id: element['gejala_demam']
                                },
                                batuk: {
                                    id: element['gejala_batuk']
                                },
                                pilek: {
                                    id: element['gejala_pilek']
                                },
                                sakitTenggorokan: {
                                    id: element['gejala_sakittenggorokan']
                                },
                                sesakNapas: {
                                    id: element['gejala_sesak']
                                },
                                lemas: {
                                    id: element['gejala_lemas']
                                },
                                nyeriOtot: {
                                    id: element['gejala_nyeriotot']
                                },
                                mualMuntah: {
                                    id: element['gejala_mual']
                                },
                                diare: {
                                    id: element['gejala_diare']
                                },
                                anosmia: {
                                    id: element['gejala_anosmia']
                                },
                                napasCepat: {
                                    id: element['napas_cepat']
                                },
                                frekNapas30KaliPerMenit: {
                                    id: element['frek_napas']
                                },
                                distresPernapasanBerat: {
                                    id: element['distress']
                                },
                                lainnya: {
                                    id: element['gejala_lainnya']
                                }
                            }
                    })
                })
                callback(null, results)
            },(error) => {
                throw error
            }
        )
        .catch((error) => {
                callback(error, null)
            }
        )
    }

    show(user, id, callback) {
        const database = new Database(pool)
        const sql = 'SELECT ' +
            'covid.covid_v3.id_trans,' +
            'covid.covid_v3.nik,' +
            'covid.covid_v3.nomr as no_rm,' +
            'covid.covid_v3.initial as nama_inisial,' +
            'covid.covid_v3.nama_lengkap as nama_lengkap,' +
            'covid.covid_v3.gender as jenis_kelamin_id,' +
            'CASE ' +
                'WHEN covid.covid_v3.gender = "L" THEN "Laki-Laki"' +
                'WHEN covid.covid_v3.gender = "P" THEN "Perempuan"' +
                'ELSE "Lainnya"' +
            'END as jenis_kelamin_nama,' +
            'covid.covid_v3.birthdate as tanggal_lahir,' +
            'covid.covid_v3.email,' +
            'covid.covid_v3.notelp as no_telp,' +
            'covid.kelompokumur.kelompok_umur as kelompok_umur,' +
            'covid.covid_v3.kecamatan as domisili_kecamatan_id,' +
            'reference.kecamatan.nama as domisili_kecamatan_nama,' +
            'reference.kab_kota.id as domisili_kab_kota_id,' +
            'reference.kab_kota.nama as domisili_kab_kota_nama,' +
            'reference.provinsi.id as domisili_provinsi_id,' +
            'reference.provinsi.nama as domisili_provinsi_nama,' +
            'covid.covid_v3.tglmasuk as tanggal_masuk,' +
            'covid.covid_v3.profesi as pekerjaan_id,' +
            'covid.profesi.deskripsi as pekerjaan_nama,' +
            'covid.covid_v3.jenis_pasien as jenis_pasien_id,' +
            'covid.jenis_pasien.deskripsi as jenis_pasien_nama,' +
            'covid.covid_v3.varian as varian_covid_id, ' +
            'm_varian_covid.jenis_varian as varian_covid_nama, ' +
            'covid.covid_v3.status_rawat as status_pasien_id,' +
            'covid.status_rawat_kmk.status as status_pasien_nama ,' +
            'CASE ' +
                'WHEN covid.covid_v3.komorbid = "0" THEN "tidak"' +
                'WHEN covid.covid_v3.komorbid = "1" THEN "ya"' +
                'ELSE "null"' +
            'END as status_komorbid_nama,' +
            'covid.covid_v3.coinsiden as status_coinsiden_id,' +
            'CASE ' +
                'WHEN covid.covid_v3.coinsiden = "0" THEN "tidak"' +
                'WHEN covid.covid_v3.coinsiden = "1" THEN "ya"' +
                'ELSE "null"' +
            'END as status_coinsiden_nama,' +
            'covid.covid_v3.status_isolasi as status_rawat_id,' +
            'db_fasyankes.m_tempat_tidur.tt as status_rawat_nama,' +
            'covid.covid_v3.alatoksigen as alat_oksigen_id,' +
            'covid.m_alatoksigen.nama_alat as alat_oksigen_nama,' +
            'covid.covid_v3.saturasi as saturasi_oksigen,' +
            'covid.covid_v3.oksigen as terapi_oksigen_id,' +
            'CASE ' +
                'WHEN covid.covid_v3.oksigen = "0" THEN "tidak"' +
                'WHEN covid.covid_v3.oksigen = "1" THEN "ya"' +
                'ELSE "null"' +
            'END as terapi_oksigen_nama,' +
            'covid.covid_v3.penyintas as penyintas_id,' +
            'CASE ' +
                'WHEN covid.covid_v3.penyintas = "0" THEN "tidak"' +
                'WHEN covid.covid_v3.penyintas = "1" THEN "ya"' +
                'ELSE "null"' +
            'END as penyintas_nama,' +
            'covid.covid_v3.tgl_lapor as tanggal_lapor,' +
            'covid.covid_v3.gejala as gejala_id, ' +
            'm_gejala_covid.deskripsi_gejala as gejala_nama,' +
            'covid.covid_v3.gejala_demam,' +
            'covid.covid_v3.gejala_batuk,' +
            'covid.covid_v3.gejala_pilek,' +
            'covid.covid_v3.gejala_sakittenggorokan,' +
            'covid.covid_v3.gejala_sesak,' +
            'covid.covid_v3.gejala_lemas,' +
            'covid.covid_v3.gejala_nyeriotot,' +
            'covid.covid_v3.gejala_mual,' +
            'covid.covid_v3.gejala_diare,' +
            'covid.covid_v3.gejala_anosmia,' +
            'covid.covid_v3.napas_cepat,' +
            'covid.covid_v3.frek_napas,' +
            'covid.covid_v3.distress,' +
            'covid.covid_v3.gejala_lainnya ' +
        'FROM ' +
            'covid.covid_v3 ' +
            'LEFT OUTER JOIN covid.kelompokumur ON covid.kelompokumur.id_umur = covid.covid_v3.age ' +
            'LEFT OUTER JOIN reference.kecamatan ON reference.kecamatan.id = covid.covid_v3.kecamatan ' +
            'LEFT OUTER JOIN reference.kab_kota ON reference.kab_kota.id = reference.kecamatan.kab_kota_id ' +
            'LEFT OUTER JOIN reference.provinsi ON reference.provinsi.id = reference.kab_kota.provinsi_id ' +
            'LEFT OUTER JOIN covid.profesi ON covid.profesi.id_profesi = covid.covid_v3.profesi ' +
            'LEFT OUTER JOIN covid.jenis_pasien ON covid.jenis_pasien.id_jenis_pasien = covid.covid_v3.jenis_pasien ' +
            'LEFT OUTER JOIN covid.m_varian_covid ON covid.m_varian_covid.id = covid.covid_v3.varian ' +
            'LEFT OUTER JOIN covid.status_rawat_kmk ON covid.status_rawat_kmk.id_status_rawat = covid.covid_v3.status_rawat ' +
            'LEFT OUTER JOIN covid.m_alatoksigen ON covid.m_alatoksigen.id_alat = covid.covid_v3.oksigen ' +
            'LEFT OUTER JOIN covid.m_gejala_covid ON covid.m_gejala_covid.id_gejala = covid.covid_v3.gejala ' +
            'LEFT OUTER JOIN db_fasyankes.m_tempat_tidur ON db_fasyankes.m_tempat_tidur.id_tt = covid.covid_v3.status_isolasi ' +
        'WHERE covid.covid_v3.tglkeluar = "0000-00-00" and covid.covid_v3.koders = ? and covid.covid_v3.id_trans = ? '

        const sqlFilterValue = [
            user.kode_rs,
            id
        ]

        database.query(sql, sqlFilterValue)
        .then(
            (res) => {
                // console.log(res)
                const results = []
                let tanggal_masuk = null
                res.forEach(element => {
                    if (element['tanggal_masuk'] == '0000-00-00') {
                        tanggal_masuk = element['tanggal_masuk']
                    } else {
                        tanggal_masuk = dateFormat(element['tanggal_masuk'],'yyyy-mm-dd')
                    }
                    results.push({
                        id: element['id_trans'],
                        noRM: element['no_rm'],
                        namaInisialPasien: element['nama_inisial'],
                        tanggalLahir: dateFormat(element['tanggal_lahir'],'yyyy-mm-dd'),
                        jenisKelamin: {
                            id: element['jenis_kelamin_id'],
                            nama: element['jenis_kelamin_nama']
                        },
                        email: element['email'],
                        domisiliAlamat: {
                            kecamatan: {
                                id: element['domisili_kecamatan_id'],
                                nama: element['domisili_kecamatan_nama']
                            },
                            kabKota: {
                                id: parseInt(element['domisili_kab_kota_id']),
                                nama: element['domisili_kab_kota_nama']
                            },
                            provinsi: {
                                id: parseInt(element['domisili_provinsi_id']),
                                nama: element['domisili_provinsi_nama']
                            }
                        },
                        noTelp: element['no_telp'],
                        tanggalMasuk: tanggal_masuk,
                        pekerjaan: {
                            id: element['pekerjaan_id'],
                            nama: element['pekerjaan_nama']
                        },
                        jenisPasien: {
                            id: element['jenis_pasien_id'],
                            nama: element['jenis_pasien_nama']
                        },
                        varianCovid: {
                            id: element['varian_covid_id'],
                            nama: element['varian_covid_nama']
                        },
                        statusPasien: {
                            id: element['status_pasien_id'],
                            nama: element['status_pasien_nama']
                        },
                        statusKomorbid: {
                            id: element['status_komorbid_id'],
                            nama: element['status_komorbid_nama']
                        },
                        statusCoInsiden: {
                            id: element['status_coinsiden_id'],
                            nama: element['status_coinsiden_nama']
                        },
                        statusRawat: {
                            id: element['status_rawat_id'],
                            nama: element['status_rawat_nama']
                        },
                        alatOksigen: {
                            id: element['alat_oksigen_id'],
                            nama: element['alat_oksigen_nama']
                        },
                        saturasiOksigen: element['saturasi_oksigen'],
                        terapiOksigen: {
                            id: element['terapi_oksigen_id'],
                            nama: element['terapi_oksigen_nama']
                        },
                        penyintas: {
                            id: element['penyintas_id'],
                            nama: element['penyintas_nama']
                        },
                        tanggalLapor: dateFormat(element['tanggal_lapor'],'yyyy-mm-dd hh:mm:ss'),
                        kelompokGejala: {
                            id: element['gejala_id'],
                            nama: element['gejala_nama']
                        },
                        gejala: 
                            {
                                demam: {
                                    id: element['gejala_demam']
                                },
                                batuk: {
                                    id: element['gejala_batuk']
                                },
                                pilek: {
                                    id: element['gejala_pilek']
                                },
                                sakitTenggorokan: {
                                    id: element['gejala_sakittenggorokan']
                                },
                                sesakNapas: {
                                    id: element['gejala_sesak']
                                },
                                lemas: {
                                    id: element['gejala_lemas']
                                },
                                nyeriOtot: {
                                    id: element['gejala_nyeriotot']
                                },
                                mualMuntah: {
                                    id: element['gejala_mual']
                                },
                                diare: {
                                    id: element['gejala_diare']
                                },
                                anosmia: {
                                    id: element['gejala_anosmia']
                                },
                                napasCepat: {
                                    id: element['napas_cepat']
                                },
                                frekNapas30KaliPerMenit: {
                                    id: element['frek_napas']
                                },
                                distresPernapasanBerat: {
                                    id: element['distress']
                                },
                                lainnya: {
                                    id: element['gejala_lainnya']
                                }
                            }
                    })
                })
                callback(null, results)
            },(error) => {
                throw error
            }
        )
        .catch((error) => {
                callback(error, null)
            }
        )
    }

    insertDataEncripted(data, callback) {
        const database = new Database(pool)
        // Searching NIK in NAR API
        // ########################################################################################
        this.getNIKData(data.nik)
        .then(
            (resNIKData) => {
                // Initialing global variable
                // ################################################################################
                let record = []
                let hasilLab = []
                let plaintext = []
                let tanggalLahir = null
                let jenisKelamin = null
                let kecamatanId = null
                let kabKotaId = null
                let provinsiId = null
                // if nik was found in NAR API
                // ################################################################################
                if (resNIKData.result_code == 200) {
                    // Assigning global variable with NAR API response
                    // ############################################################################
                    tanggalLahir = resNIKData.data[0].tgl_lahir
                    jenisKelamin = resNIKData.data[0].jkel
                    kecamatanId = resNIKData.data[0].alamat_kabkd
                    kabKotaId = resNIKData.data[0].alamat_kabkd
                    provinsiId = resNIKData.data[0].alamat_propkd
                    // Assigning plaintext with NAR API response
                    // ############################################################################
                    plaintext.push(
                        resNIKData.data[0].nik,
                        resNIKData.data[0].nama
                    )
                }
                // if nik was not found in NAR API
                // ################################################################################
                else {
                    // Assigning global variable with user entri
                    // ############################################################################
                    tanggalLahir = data.tanggalLahir
                    jenisKelamin = data.jenisKelaminId
                    kecamatanId = data.domisiliKecamatanId
                    kabKotaId = data.domisiliKabKotaId
                    provinsiId = data.domisiliProvinsiId
                    // Assigning plaintext with user entri
                    // ############################################################################
                    plaintext.push(
                        data.nik,
                        data.namaLengkapPasien
                    )
                }
                // Encripting NIK and Name
                // ###############################################################################
                this.getCipertext(...plaintext)
                .then(
                    (resCipertext) => {
                        // Preparing Searching NIK query
                        // #######################################################################
                        const sqlNIKSearch = 'SELECT ' +
                            'covid.covid_v3.id_trans,' +
                            'covid.covid_v3.nik ' +
                        'FROM covid.covid_v3 ' +
                        'WHERE covid.covid_v3.koders = ? AND covid.covid_v3.nik = ? AND covid.covid_v3.tglkeluar = "0000-00-00"'
                        const sqlFilterValue = [
                            data.kodeRS,
                            resCipertext[0].data.result
                        ]
                        // Searching NIK in DB
                        // ##################################################################################
                        database.query(sqlNIKSearch, sqlFilterValue)
                        .then(
                            (resNIKSearch) => {
                                // if nik was found in DB
                                if (resNIKSearch.length > 0) {
                                    callback(null, 1)
                                } 
                                // if nik was not found in DB
                                // ###########################################################################
                                else {
                                    // Assigning record variable
                                    // #######################################################################
                                    record = [
                                        data.kewarganegaraanId,
                                        1,
                                        resCipertext[0].data.result,
                                        data.noPassport,
                                        data.asalPasienId,
                                        data.kodeRS,
                                        data.noRM,
                                        resCipertext[1].data.result,
                                        data.namaInisialPasien,
                                        tanggalLahir,
                                        data.pengelompokanUmur,
                                        data.email,
                                        data.noTelp,
                                        jenisKelamin,
                                        kecamatanId,
                                        kabKotaId,
                                        provinsiId,
                                        data.pekerjaanId,
                                        data.tanggalMasuk,
                                        data.jenisPasienId,
                                        data.varianCovidId,
                                        data.statusRawatId,
                                        data.severityLevelId,
                                        data.statusCoInsidenId,
                                        data.statusIsolasiId,
                                        0,
                                        data.saturasiOksigen,
                                        data.terapiOksigenId,
                                        data.alatOksigenId,
                                        data.ipConsumer,
                                        data.pengelompokanKewarganegaraan,
                                        0,
                                        data.penyintasId,
                                        data.tanggalOnsetGejala,
                                        data.kelompokGejalaId,
                                        data.gejala.demamId,
                                        data.gejala.batukId,
                                        data.gejala.pilekId,
                                        data.gejala.sakitTenggorokanId,
                                        data.gejala.sesakNapasId,
                                        data.gejala.lemasId,
                                        data.gejala.nyeriOtotId,
                                        data.gejala.mualMuntahId,
                                        data.gejala.diareId,
                                        data.gejala.anosmiaId,
                                        data.gejala.napasCepatId,
                                        data.gejala.frekNapas30KaliPerMenitId,
                                        data.gejala.distresPernapasanBeratId,
                                        data.gejala.lainnyaId,
                                        '0000-00-00',
                                        2
                                    ]
                                    // Preparing insert command for covid data
                                    // #######################################################################
                                    const sqlInsert = 'INSERT INTO covid.covid_v3 ' +
                                        '( ' +
                                        'kode_negara,' +
                                        'kewarganegaraan, ' +
                                        'nik,' +
                                        'no_identitas_lain,' +
                                        'asalpasien,' +
                                        'koders,' +
                                        'nomr,' +
                                        'nama_lengkap,' +
                                        'initial,' +
                                        'birthdate,' +
                                        'age,' +
                                        'email,' +
                                        'notelp,' +
                                        'gender,' +
                                        'kecamatan,' +
                                        'kabkota,' +
                                        'propinsi,' +
                                        'profesi,' +
                                        'tglmasuk,' +
                                        'jenis_pasien,' +
                                        'varian,' +
                                        'status_rawat,' +
                                        'severity,' +
                                        'coinsiden,' +
                                        'status_isolasi,' +
                                        'saturasi_old,' +
                                        'saturasi,' +
                                        'oksigen,' +
                                        'alatoksigen,' +
                                        'ip_reg,' +
                                        'kwn, ' +
                                        'status_keluar, ' +
                                        'penyintas, ' +
                                        'tglonset, ' +
                                        'gejala, ' +
                                        'gejala_demam, ' +
                                        'gejala_batuk, ' +
                                        'gejala_pilek, ' +
                                        'gejala_sakittenggorokan, ' +
                                        'gejala_sesak, ' +
                                        'gejala_lemas, ' +
                                        'gejala_nyeriotot, ' +
                                        'gejala_mual, ' +
                                        'gejala_diare, ' +
                                        'gejala_anosmia, ' +
                                        'napas_cepat, ' +
                                        'frek_napas, ' +
                                        'distress, ' +
                                        'gejala_lainnya, ' +
                                        'tglkeluar, ' +
                                        'manual ' +
                                        ') ' +
                                    'VALUES ( ? )'
                                    // Initialing variable for inserted id transaction
                                    // #######################################################################
                                    let dataInserted = null
                                    // Inserting data covid to DB
                                    // #######################################################################
                                    database.query(sqlInsert, [record])
                                    .then(
                                        (resInsert) => {
                                            // Preparing delete command for lab result from NAR
                                            // ##########################################################################
                                            const sqlDeleteHasilLab = 'DELETE FROM covid.t_lab_nik_webservice ' +
                                                'WHERE covid.t_lab_nik_webservice.nik_encrypt = ? '
                                            // Deleting hasil lab
                                            database.query(sqlDeleteHasilLab, [resCipertext[0].data.result])
                                            .then(
                                                (resDeleteHasilLab) => {
                                                    // Preparing insert command for lab result from NAR
                                                    // ###############################################################
                                                    const sqlInsertHasilLab = 'INSERT INTO covid.t_lab_nik_webservice ' +
                                                        '( ' +
                                                        'faskes,' +
                                                        'namalab,' +
                                                        'tglpengambilan,' +
                                                        'tglhasil,' +
                                                        'hasillab,' +
                                                        'sgtf_tgl_hasil,' +
                                                        'sgtf_hasil,' +
                                                        'sgtf_created_by,' +
                                                        'wgs_tgl_hasil,' +
                                                        'wgs_hasil,' +
                                                        'wgs_created_by,' +
                                                        'nik,' +
                                                        'nik_encrypt' +
                                                        ') ' +
                                                    'VALUES ? '
                                                    // if NIK was found in NAR API
                                                    // ################################################################################
                                                    if (resNIKData.result_code == 200) {
                                                        // Assigning hasil lab with NAR API response
                                                        // ############################################################################
                                                        resNIKData.data.forEach(element => {
                                                            hasilLab.push([
                                                                element.faskes_nm,
                                                                element.nm_lab,
                                                                element.tgl_pengambilan,
                                                                element.tgl_hasil,
                                                                element.hsl_lab,
                                                                element.sgtf_tgl_hasil,
                                                                element.sgtf_hasil,
                                                                element.sgtf_created_by,
                                                                element.wgs_tgl_hasil,
                                                                element.wgs_hasil,
                                                                element.wgs_created_by,
                                                                data.nik,
                                                                resCipertext[0].data.result
                                                            ])
                                                        })
                                                        // Inserting result lab data
                                                        // ############################################################################
                                                        return database.query(sqlInsertHasilLab,[hasilLab])
                                                    }
                                                    return
                                                }, (error) => {
                                                    throw error
                                                }
                                            )
                                            .then(
                                                (resHasilLab) => {
                                                    // Searching Vaksin Data in Peduli Lindungi
                                                    // ################################################################################
                                                    this.getVaksinData(data.nik)
                                                    .then(
                                                        (resVaksinData) => {
                                                            // if data vaksin was founded
                                                            // ########################################################################
                                                            if(resVaksinData.data.message == 'data found') {
                                                                // Preparing delete command for vaksin
                                                                // ##########################################################################
                                                                const sqlDeleteVaksin = 'DELETE FROM covid.t_api_vaksin_dto ' +
                                                                    'WHERE covid.t_api_vaksin_dto.nik_encrypt = ? '
                                                                // Deleting Vaksin
                                                                database.query(sqlDeleteVaksin, [resCipertext[0].data.result])
                                                                .then(
                                                                    (resDeleteVaksin) => {
                                                                        // Assigning vaksin variable
                                                                        // ####################################################################
                                                                        let vaksinData = []
                                                                        let vaksinKe = null
                                                                        resVaksinData.data.data.forEach(element => {
                                                                            if (element['type'] == 'first') {
                                                                                vaksinKe = 1
                                                                            } else if (element['type'] == 'second') {
                                                                                vaksinKe = 2
                                                                            } else if (element['type'] == 'third') {
                                                                                vaksinKe = 3
                                                                            }
                                                                            vaksinData.push([
                                                                                data.nik,
                                                                                dateFormat(element['date'], 'yyyy-mm-dd'),
                                                                                vaksinKe,
                                                                                element['vaccine_type'],
                                                                                element['vaccine_type_name'],
                                                                                resCipertext[0].data.result
                                                                            ])
                                                                        })
                                                                        // Preparing insert command for vaksin
                                                                        // ###############################################################
                                                                        const sqlInsertVaksin = 'INSERT INTO covid.t_api_vaksin_dto ' +
                                                                            '( ' +
                                                                                'nik,' +
                                                                                'tglvaksin,' +
                                                                                'vaksin_ke,' +
                                                                                'tipe_vaksin,' +
                                                                                'nama_vaksin,' +
                                                                                'nik_encrypt' +
                                                                            ') ' +
                                                                        'VALUES ? '
                                                                        // Inserting Vaksin Data to DB
                                                                        // ################################################################
                                                                        database.query(sqlInsertVaksin,[vaksinData])
                                                                        .then(
                                                                            (resInsertVaksin) => {
                                                                                dataInserted = {
                                                                                    id: resInsert.insertId
                                                                                }
                                                                                callback(null, dataInserted)
                                                                            }
                                                                        )
                                                                        .catch((error) => {
                                                                            callback(error, null)
                                                                        })
                                                                    }
                                                                )
                                                                .catch((error) => {
                                                                    callback(error, null)
                                                                })
                                                                return
                                                            }
                                                            dataInserted = {
                                                                id: resInsert.insertId
                                                            }
                                                            callback(null, dataInserted)
                                                        }
                                                    )
                                                    .catch((error) => {
                                                        callback(error, null)
                                                    })
                                                }, (error) => {
                                                    throw error
                                                }
                                            )
                                            .catch(
                                                (error) => {
                                                    callback(error, null)
                                                }
                                            )
                                        }, (error) => {
                                            throw error
                                        }
                                    )
                                    .catch(
                                        (error) => {
                                            callback(error, null)
                                        }
                                    )
                                }
                            }
                        )
                        .catch((error) => {
                            callback(error, null)
                        })
                    }
                )
                .catch((error) => {
                    callback(error, null)
                })
            }
        )
        .catch((error) => {
            callback(error, null)
        })
    }

    updateDataEncripted(data, id, callback) {
        const database = new Database(pool)
        // Searching NIK in NAR API
        // ########################################################################################
        this.getNIKData(data.nik)
        .then(
            (resNIKData) => {
                // Initialing global variable
                // ################################################################################
                const laporanCovid19Versi3Id = parseInt(id)
                let record = []
                let hasilLab = []
                let plaintext = []
                let tanggalLahir = null
                let jenisKelamin = null
                let kecamatanId = null
                let kabKotaId = null
                let provinsiId = null
                // if nik was found in NAR API
                // ################################################################################
                if (resNIKData.result_code == 200) {
                    // Assigning global variable with NAR API response
                    // ############################################################################
                    tanggalLahir = resNIKData.data[0].tgl_lahir
                    jenisKelamin = resNIKData.data[0].jkel
                    kecamatanId = resNIKData.data[0].alamat_kabkd
                    kabKotaId = resNIKData.data[0].alamat_kabkd
                    provinsiId = resNIKData.data[0].alamat_propkd
                    // Assigning plaintext with NAR API response
                    // ############################################################################
                    plaintext.push(
                        resNIKData.data[0].nik,
                        resNIKData.data[0].nama
                    )
                }
                // if nik was not found in NAR API
                // ################################################################################
                else {
                    // Assigning global variable with user entri
                    // ############################################################################
                    tanggalLahir = data.tanggalLahir
                    jenisKelamin = data.jenisKelaminId
                    kecamatanId = data.domisiliKecamatanId
                    kabKotaId = data.domisiliKabKotaId
                    provinsiId = data.domisiliProvinsiId
                    // Assigning plaintext with user entri
                    // ############################################################################
                    plaintext.push(
                        data.nik,
                        data.namaLengkapPasien
                    )
                }
                // Encripting NIK and Name
                // ###############################################################################
                this.getCipertext(...plaintext)
                .then(
                    (resCipertext) => {
                        // Preparing Searching NIK query
                        // #######################################################################
                        const sqlNIKSearch = 'SELECT ' +
                            'covid.covid_v3.id_trans,' +
                            'covid.covid_v3.nik ' +
                        'FROM covid.covid_v3 ' +
                        'WHERE covid.covid_v3.koders = ? AND covid.covid_v3.nik = ? AND covid.covid_v3.id_trans != ? AND covid.covid_v3.tglkeluar = "0000-00-00"'
                        const sqlFilterValue = [
                            data.kodeRS,
                            resCipertext[0].data.result,
                            laporanCovid19Versi3Id
                        ]
                        // Searching NIK in DB
                        // #######################################################################
                        database.query(sqlNIKSearch, sqlFilterValue)
                        .then(
                            (resNIKSearch) => {
                                // if nik was found in DB
                                if (resNIKSearch.length > 0) {
                                    callback(null, 1)
                                } 
                                // if nik was not found in DB
                                // ###########################################################################
                                else {
                                    // Assigning record variable
                                    // #######################################################################
                                    record = [
                                        data.kewarganegaraanId,
                                        resCipertext[0].data.result,
                                        data.noPassport,
                                        data.asalPasienId,
                                        data.noRM,
                                        resCipertext[1].data.result,
                                        data.namaInisialPasien,
                                        tanggalLahir,
                                        data.pengelompokanUmur,
                                        data.email,
                                        data.noTelp,
                                        jenisKelamin,
                                        kecamatanId,
                                        kabKotaId,
                                        provinsiId,
                                        data.pekerjaanId,
                                        data.tanggalMasuk,
                                        data.jenisPasienId,
                                        data.varianCovidId,
                                        data.statusRawatId,
                                        data.severityLevelId,
                                        data.statusCoInsidenId,
                                        data.statusIsolasiId,
                                        data.saturasiOksigen,
                                        data.terapiOksigenId,
                                        data.alatOksigenId,
                                        data.ipConsumer,
                                        data.pengelompokanKewarganegaraan,
                                        data.penyintasId,
                                        data.tanggalOnsetGejala,
                                        data.kelompokGejalaId,
                                        data.gejala.demamId,
                                        data.gejala.batukId,
                                        data.gejala.pilekId,
                                        data.gejala.sakitTenggorokanId,
                                        data.gejala.sesakNapasId,
                                        data.gejala.lemasId,
                                        data.gejala.nyeriOtotId,
                                        data.gejala.mualMuntahId,
                                        data.gejala.diareId,
                                        data.gejala.anosmiaId,
                                        data.gejala.napasCepatId,
                                        data.gejala.frekNapas30KaliPerMenitId,
                                        data.gejala.distresPernapasanBeratId,
                                        data.gejala.lainnyaId,
                                        laporanCovid19Versi3Id,
                                        data.kodeRS
                                    ]
                                    // Preparing update command for covid data
                                    // #######################################################################
                                    const sqlUpdate = 'UPDATE covid.covid_v3 SET ' +
                                        'kode_negara=?,' +
                                        'nik=?,' +
                                        'no_identitas_lain=?,' +
                                        'asalpasien=?,' +
                                        'nomr=?,' +
                                        'nama_lengkap=?,' +
                                        'initial=?,' +
                                        'birthdate=?,' +
                                        'age=?,' +
                                        'email=?,' +
                                        'notelp=?,' +
                                        'gender=?,' +
                                        'kecamatan=?,' +
                                        'kabkota=?,' +
                                        'propinsi=?,' +
                                        'profesi=?,' +
                                        'tglmasuk=?,' +
                                        'jenis_pasien=?,' +
                                        'varian=?,' +
                                        'status_rawat=?,' +
                                        'severity=?,' +
                                        'coinsiden=?,' +
                                        'status_isolasi=?,' +
                                        'saturasi=?,' +
                                        'oksigen=?, ' +
                                        'alatoksigen=?, ' +
                                        'ip_reg=?,' +
                                        'kwn=?, ' +
                                        'penyintas=?, ' +
                                        'tglonset=?, ' +
                                        'gejala=?, ' +
                                        'gejala_demam=?, ' +
                                        'gejala_batuk=?, ' +
                                        'gejala_pilek=?, ' +
                                        'gejala_sakittenggorokan=?, ' +
                                        'gejala_sesak=?, ' +
                                        'gejala_lemas=?, ' +
                                        'gejala_nyeriotot=?, ' +
                                        'gejala_mual=?, ' +
                                        'gejala_diare=?, ' +
                                        'gejala_anosmia=?, ' +
                                        'napas_cepat=?, ' +
                                        'frek_napas=?, ' +
                                        'distress=?, ' +
                                        'gejala_lainnya=?, ' +
                                        'tgl_update=now() ' +
                                    'WHERE id_trans = ? AND koders = ?'
                                    // Updating data covid to DB
                                    // ##################################################################################
                                    database.query(sqlUpdate, record)
                                    .then(
                                        (resUpdate) => {
                                            // Preparing delete command for lab result from NAR
                                            // ##########################################################################
                                            const sqlDeleteHasilLab = 'DELETE FROM covid.t_lab_nik_webservice ' +
                                                'WHERE covid.t_lab_nik_webservice.nik_encrypt = ? '
                                            // Deleting hasil lab
                                            database.query(sqlDeleteHasilLab, [resCipertext[0].data.result])
                                            .then(
                                                (resDeleteHasilLab) => {
                                                    // Preparing insert command for lab result from NAR
                                                    // ###############################################################
                                                    const sqlInsertHasilLab = 'INSERT INTO covid.t_lab_nik_webservice ' +
                                                        '( ' +
                                                        'faskes,' +
                                                        'namalab,' +
                                                        'tglpengambilan,' +
                                                        'tglhasil,' +
                                                        'hasillab,' +
                                                        'sgtf_tgl_hasil,' +
                                                        'sgtf_hasil,' +
                                                        'sgtf_created_by,' +
                                                        'wgs_tgl_hasil,' +
                                                        'wgs_hasil,' +
                                                        'wgs_created_by,' +
                                                        'nik,' +
                                                        'nik_encrypt' +
                                                        ') ' +
                                                    'VALUES ? '
                                                    // if NIK was found in NAR API
                                                    // ################################################################################
                                                    if (resNIKData.result_code == 200) {
                                                        // Assigning hasil lab with NAR API response
                                                        // ############################################################################
                                                        resNIKData.data.forEach(element => {
                                                            hasilLab.push([
                                                                element.faskes_nm,
                                                                element.nm_lab,
                                                                element.tgl_pengambilan,
                                                                element.tgl_hasil,
                                                                element.hsl_lab,
                                                                element.sgtf_tgl_hasil,
                                                                element.sgtf_hasil,
                                                                element.sgtf_created_by,
                                                                element.wgs_tgl_hasil,
                                                                element.wgs_hasil,
                                                                element.wgs_created_by,
                                                                data.nik,
                                                                resCipertext[0].data.result
                                                            ])
                                                        })
                                                        // Inserting result lab data
                                                        // #############################################################################
                                                        return database.query(sqlInsertHasilLab,[hasilLab])
                                                    }
                                                    return
                                                }, (error) => {
                                                    throw error
                                                }
                                            )
                                            .then(
                                                (resInsertHasilLab) => {
                                                    // Searching Vaksin Data in Peduli Lindungi
                                                    // ######################################################################################
                                                    this.getVaksinData(data.nik)
                                                    .then(
                                                        (resVaksinData) => {
                                                            // if data vaksin was founded
                                                            // ##############################################################################
                                                            if(resVaksinData.data.message == 'data found') {
                                                                // Preparing delete command for vaksin
                                                                // ##########################################################################
                                                                const sqlDeleteVaksin = 'DELETE FROM covid.t_api_vaksin_dto ' +
                                                                    'WHERE covid.t_api_vaksin_dto.nik_encrypt = ? '
                                                                // Deleting Vaksin
                                                                database.query(sqlDeleteVaksin, [resCipertext[0].data.result])
                                                                .then(
                                                                    (resDeleteVaksin) => {
                                                                        // Assigning vaksin variable
                                                                        // ####################################################################
                                                                        let vaksinData = []
                                                                        let vaksinKe = null
                                                                        resVaksinData.data.data.forEach(element => {
                                                                            if (element['type'] == 'first') {
                                                                                vaksinKe = 1
                                                                            } else if (element['type'] == 'second') {
                                                                                vaksinKe = 2
                                                                            } else if (element['type'] == 'third') {
                                                                                vaksinKe = 3
                                                                            }
                                                                            vaksinData.push([
                                                                                data.nik,
                                                                                dateFormat(element['date'], 'yyyy-mm-dd'),
                                                                                vaksinKe,
                                                                                element['vaccine_type'],
                                                                                element['vaccine_type_name'],
                                                                                resCipertext[0].data.result
                                                                            ])
                                                                        })
                                                                        // Preparing insert command for vaksin
                                                                        // ###############################################################
                                                                        const sqlInsertVaksin = 'INSERT INTO covid.t_api_vaksin_dto ' +
                                                                            '( ' +
                                                                                'nik,' +
                                                                                'tglvaksin,' +
                                                                                'vaksin_ke,' +
                                                                                'tipe_vaksin,' +
                                                                                'nama_vaksin,' +
                                                                                'nik_encrypt' +
                                                                            ') ' +
                                                                        'VALUES ? '
                                                                        // Inserting Vaksin Data to DB
                                                                        // ################################################################
                                                                        database.query(sqlInsertVaksin,[vaksinData])
                                                                        .then(
                                                                            (resInsertVaksin) => {
                                                                                if (resNIKData.result_code == 200) {
                                                                                    if (resInsertVaksin.affectedRows === 0 && resInsertVaksin.changedRows === 0) {
                                                                                        callback(null, 'no row matched');
                                                                                        return
                                                                                    }
                                                                                }
                                                                                let resourceUpdated = {
                                                                                    id: id
                                                                                }
                                                                                callback(null, resourceUpdated);
                                                                            }
                                                                        )
                                                                        .catch((error) => {
                                                                            callback(error, null)
                                                                        })
                                                                    }
                                                                )
                                                                .catch((error) => {
                                                                    callback(error, null)
                                                                })
                                                                return
                                                            }
                                                            let resourceUpdated = {
                                                                id: id
                                                            }
                                                            callback(null, resourceUpdated);
                                                        }
                                                    )
                                                    .catch((error) => {
                                                        callback(error, null)
                                                    })
                                                }, (error) => {
                                                    throw error
                                                }
                                            )
                                            .catch(
                                                (error) => {
                                                    callback(error, null)
                                                }
                                            )
                                        }
                                    )
                                    .catch(
                                        (error) => {
                                            callback(error, null)
                                        }
                                    )
                                }
                            }
                        )
                        .catch((error) => {
                            callback(error, null)
                        })
                    }
                )
                .catch((error) => {
                    callback(error, null)
                })
            }
        )
        .catch((error) => {
            callback(error, null)
        })
    }

    getNIKData(args) {
        // const endPoint = 'https://ws-direktori.kemkes.go.id/sampel_yankes/1/covid_api/api/sampel_feed/nik_yankes'

        // const config = {
        //     headers: {
        //         'apikey': 'eyJ4NXQiOiJOVGRtWmpNNFpEazNOalkwWXpjNU1tWm1PRGd3TVRFM01XWXdOREU1TVdSbFpEZzROemM0WkE9PSIsImtpZCI6ImdhdGV3YXlfY2VydGlmaWNhdGVfYWxpYXMiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ1c2VyX3lhbmtlc0BjYXJib24uc3VwZXIiLCJhcHBsaWNhdGlvbiI6eyJvd25lciI6InVzZXJfeWFua2VzIiwidGllclF1b3RhVHlwZSI6bnVsbCwidGllciI6IlVubGltaXRlZCIsIm5hbWUiOiJyc29ubGluZSIsImlkIjo1OCwidXVpZCI6ImQ3OTRkYjkzLWU5Y2EtNDQxZS1hM2QxLTNlNDViMTdjZWZhOCJ9LCJpc3MiOiJodHRwczpcL1wvd3NtLWRpcmVrdG9yaS5rZW1rZXMuZ28uaWQ6NDQzXC9vYXV0aDJcL3Rva2VuIiwidGllckluZm8iOnsiVW5saW1pdGVkIjp7InRpZXJRdW90YVR5cGUiOiJyZXF1ZXN0Q291bnQiLCJncmFwaFFMTWF4Q29tcGxleGl0eSI6MCwiZ3JhcGhRTE1heERlcHRoIjowLCJzdG9wT25RdW90YVJlYWNoIjp0cnVlLCJzcGlrZUFycmVzdExpbWl0IjowLCJzcGlrZUFycmVzdFVuaXQiOm51bGx9fSwia2V5dHlwZSI6IlBST0RVQ1RJT04iLCJwZXJtaXR0ZWRSZWZlcmVyIjoiIiwic3Vic2NyaWJlZEFQSXMiOlt7InN1YnNjcmliZXJUZW5hbnREb21haW4iOiJjYXJib24uc3VwZXIiLCJuYW1lIjoic2FtcGVsX3lhbmtlcyIsImNvbnRleHQiOiJcL3NhbXBlbF95YW5rZXNcLzEiLCJwdWJsaXNoZXIiOiJhZG1pbiIsInZlcnNpb24iOiIxIiwic3Vic2NyaXB0aW9uVGllciI6IlVubGltaXRlZCJ9XSwicGVybWl0dGVkSVAiOiIiLCJpYXQiOjE2NDIxNjQ2NDQsImp0aSI6IjFhNDZlYjRlLWU4MTktNGI1Zi05MGM0LTJkYzliNDI3YTJhOCJ9.LoXLXsMXzuV-P5osuCo6q8HiPO42ZNh-v_XB6XNpvLyvmYl2VbOSPJLo8Gycdcu86GLHSO35g4MnNvE8EqejbFmaSnl5e-9IvcYJKexOkGQWvm4MMM355SKD9U05riSa6kjUANV2403SRalYkrUVSq9vR_q-Pv6_HpSmc78Tv7T7WarkEQ7yY7CgycNJO0n5AOBpoJ4yx07VchAB4rZSQyLnVFOEqw4ndWoDJU68-G9J-mgsHFDnZiuyw6MTJ2MZvSOHDGCX6PkFGFygYlCXIFJ3brwtuwWyWzgkueZA9JfPA5eG_os0GfcfvGo4pxx7Do9a2e3qbQUjrC6_fECWRw==',
        //         'Content-Type': 'application/json'
        //     },
        //     httpsAgent: new https.Agent({
        //         rejectUnauthorized: false
        //     })
        // }

        const endPoint = 'https://api-tc19.kemkes.go.id/covid_api/api/sampel_feed/nik_yankes'
        
        const config = {
            headers: {
                'Api-Kemkes': 'B4PY6bkQ34vLsx2Ma8VKkq7QV4fX7Fc4t5j5mkzqLE6dWe36XkDtJeTxqU3uUnXAUD8EHJ5bCZTUTsLZ',
                'Content-Type': 'application/json'
            }   
        }

        const body = {
            "name":"yankes",
            "pass":"hPkRnUrWtYw3y5A8DaFdJfMhQmSpUsXuZw4z6B9E",
            "nik": args,
            "jnsid": "1"
        }
        return new Promise((resolve, reject) => {
            axios.post(endPoint, body, config)
            .then(
                (res) => {
                    resolve(res.data)
                }
            )
            .catch((error) => {
                reject(error)
            })
        })
    }
    
    getKey() {
        const endPoint = 'http://192.168.52.15:8080/api/v1/secret/rsonline'
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'X-Kms-Token': '84tMxLFWYOUJ#MFEdlVdKqmIFuKZrxVl'
            }
        }
        const body = {
            "labelsecret": "db_rsonline"
        }
        return new Promise((resolve, reject) => {
            axios.post(endPoint, body, config)
            .then(
                (res) => {
                    resolve(res.data.result)
                }
            )
            .catch(
                (error) => {
                    reject(error)
                }
            )
        })
    }
    
    getCipertext(...args) {
        return new Promise((resolve, reject) => {
            this.getKey()
            .then(
                (res) => {
                    const endPoint = 'http://192.168.49.25:3000/api/v1/encryptdb'
                    const config = {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                    const payload = args.map((value) => {
                        return {
                            "data": value,
                            "kunci": res
                        }
                    })
                    const endPoints = payload.map((value) => axios.post(endPoint, value, config))
                    Promise.all(endPoints.map((endpoint) => endpoint))
                    .then(
                        (res) => {
                            resolve(res)
                        }
                    )
                    .catch((error) => {
                        reject(error)
                    })
                }
            )
            .catch((error) => {
                reject(error)
            })
        })
    }

    getVaksinData(args) {
        return new Promise((resolve, reject) => {
            const endPoint = 'http://202.70.136.86:3030/api/vaksin'
            const config = {
                params: {
                    nik: args
                }
            }
            axios.get(endPoint, config)
            .then(
                (resVaksin) => {
                    resolve(resVaksin)
                }
            )
            .catch((error) => {
                reject(error)
            })
        })
    }
}

module.exports = LaporanCovid19Versi3