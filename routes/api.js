const express = require('express')
const router = express.Router()

const rsToken = require('../configs/RSToken')
const token = require('../configs/Token')
const userToken = require('../configs/UserToken')

const rsUserController = require('../controllers/RSUserController')
const userController = require('../controllers/UserController')
const userCredentialController = require('../controllers/UserCredentialController')
const consumerIPAddressController = require('../controllers/ConsumerIPAddressController')
const userIPController = require('../controllers/UserIPController')
const KematianController = require('../controllers/KematianController')
const LokasiKematianController = require('../controllers/LokasiKematianController')
const PenyebabKematianLangsungController = require('../controllers/PenyebabKematianLangsungController')
const KomorbidController = require('../controllers/KomorbidController')
const KomorbidCoInsidenController = require('../controllers/KomorbidCoInsidenController')
const ProvinsiController = require('../controllers/ProvinsiController')
const KabKotaController = require('../controllers/KabKotaController')
const KecamatanController = require('../controllers/KecamatanController')
const KelurahanController = require('../controllers/KelurahanController')
const RumahSakitController = require('../controllers/RumahSakitController')
const KetersediaanTempatTidurController = require('../controllers/KetersediaanTempatTidurController')
const KetersediaanNakesController = require('../controllers/KetersediaanNakesController')
const KetersediaanAlkesController = require('../controllers/KetersediaanAlkesController')
const KetersediaanPelayananController = require('../controllers/KetersediaanPelayananController')
const KlaimBPJS1Controller = require('../controllers/KlaimBPJS1Controller')
const KlaimBPJS2Controller = require('../controllers/KlaimBPJS2Controller')
const KlaimBPJS3Controller = require('../controllers/KlaimBPJS3Controller')
const KlaimBPJS4Controller = require('../controllers/KlaimBPJS4Controller')
const KlaimBPJS5Controller = require('../controllers/KlaimBPJS5Controller')
const KlaimKemKesController = require('../controllers/KlaimKemKesController')
const LaporanCovid19Versi3Controller = require('../controllers/LaporanCovid19Versi3Controller')
const KewarganegaraanController = require('../controllers/KewarganegaraanController')
const AsalPasienController = require('../controllers/AsalPasienController')
const StatusVaksinasiController = require('../controllers/StatusVaksinasiController')
const JenisPasienController = require('../controllers/JenisPasienController')
const PekerjaanController = require('../controllers/PekerjaanController')
const StatusPaseinController = require('../controllers/StatusPasienController')
const VarianCovidController = require('../controllers/VarianCovidController')
const StatusRawatController = require('../controllers/StatusRawatController')
const LaporanCovid19Versi3DiagnosaController = require('../controllers/LaporanCovid19Versi3DiagnosaController')
const LaporanCovid19Versi3KomorbidController = require('../controllers/LaporanCovid19Versi3KomorbidController')
const LaporanCovid19Versi3ObatController = require('../controllers/LaporanCovid19Versi3ObatController')
const LaporanCovid19Versi3StatusKeluarController = require('../controllers/LaporanCovid19Versi3StatusKeluarController')
const LaporanCovid19Versi3VaksinasiController = require('../controllers/LaporanCovid19Versi3VaksinasiController')
const LaporanCovid19Versi3PemeriksaanLabController = require('../controllers/LaporanCovid19Versi3PemeriksaanLabController')
const ObatController = require('../controllers/ObatController')
const StatusKeluarController = require('../controllers/StatusKeluarController')
const AlatOksigenController = require('../controllers/AlatOksigenController')
const DosisVaksinController = require('../controllers/DosisVaksinController')
const JenisVaksinController = require('../controllers/JenisVaksinController')
const KelompokGejalaController = require('../controllers/KelompokGejalaController')
const JenisPemeriksaanLabController = require('../controllers/JenisPemeriksaanLabController')
const PenyebabKematianController = require('../controllers/PenyebabKematianController')
const StatusPasienSaatMeninggalController = require('../controllers/StatusPasienSaatMeninggalController')
const UserToken = require('../configs/UserToken')

// Instance Class
const rsTokenObject = new rsToken()
const tokenObject = new token()
const userTokenObject = new userToken()

const rsUserControllerObject = new rsUserController()
const userControllerObject = new userController()
const userCredentialControllerObject = new userCredentialController()
const consumerIPAddressControllerObject = new consumerIPAddressController()
const userIPControllerObject = new userIPController()
const KematianControllerObject = new KematianController()
const LokasiKematianControllerObject = new LokasiKematianController()
const StatusPasienSaatMeninggalControllerObject = new StatusPasienSaatMeninggalController()
const PenyebabKematianLangsungControllerObject = new PenyebabKematianLangsungController()
const KomorbidControllerObject = new KomorbidController()
const KomorbidCoInsidenControllerObject = new KomorbidCoInsidenController()
const ProvinsiControllerObject = new ProvinsiController()
const KabKotaControllerObject = new KabKotaController()
const KecamatanControllerObject = new KecamatanController()
const KelurahanControllerObject = new KelurahanController()
const RumahSakitControllerObject = new RumahSakitController()
const KetersediaanTempatTidurControllerObject = new KetersediaanTempatTidurController()
const KetersediaanNakesControllerObject = new KetersediaanNakesController()
const KetersediaanAlkesControllerObject = new KetersediaanAlkesController()
const KetersediaanPelayananControllerObject = new KetersediaanPelayananController()
const KlaimBPJS1ControllerObject = new KlaimBPJS1Controller()
const KlaimBPJS2ControllerObject = new KlaimBPJS2Controller()
const KlaimBPJS3ControllerObject = new KlaimBPJS3Controller()
const KlaimBPJS4ControllerObject = new KlaimBPJS4Controller()
const KlaimBPJS5ControllerObject = new KlaimBPJS5Controller()
const KlaimKemKesControllerObject = new KlaimKemKesController()
const LaporanCovid19Versi3ControllerObject = new LaporanCovid19Versi3Controller()
const KewarganegaraanControllerOject = new KewarganegaraanController()
const AsalPasienControllerObject = new AsalPasienController()
const StatusVaksinasiControllerObject = new StatusVaksinasiController()
const JenisPasienControllerObject = new JenisPasienController()
const PekerjaanControllerObject = new PekerjaanController()
const StatusPaseinControllerObject = new StatusPaseinController()
const VarianCovidControllerObject = new VarianCovidController()
const StatusRawatControllerObject = new StatusRawatController()
const LaporanCovid19Versi3DiagnosaControllerObject = new LaporanCovid19Versi3DiagnosaController()
const LaporanCovid19Versi3KomorbidControllerObject = new LaporanCovid19Versi3KomorbidController()
const LaporanCovid19Versi3ObatControllerObject = new LaporanCovid19Versi3ObatController()
const LaporanCovid19Versi3StatusKeluarControllerObject = new LaporanCovid19Versi3StatusKeluarController()
const LaporanCovid19Versi3VaksinasiControllerObject = new LaporanCovid19Versi3VaksinasiController()
const LaporanCovid19Versi3PemeriksaanLabControllerObject = new LaporanCovid19Versi3PemeriksaanLabController()
const ObatControllerObject = new ObatController()
const StatusKeluarControllerObject = new StatusKeluarController()
const AlatOksigenControllerObject = new AlatOksigenController()
const DosisVaksinControllerObject = new DosisVaksinController()
const JenisVaksinControllerObject = new JenisVaksinController()
const KelompokGejalaControllerObject = new KelompokGejalaController()
const JenisPemeriksaanLabControllerObject = new JenisPemeriksaanLabController()
const PenyebabKematianControllerObject = new PenyebabKematianController()

// Auth
router.post('/api/tasjil', 
    userCredentialControllerObject.store)
router.post('/api/login', 
    userIPControllerObject.authenticateIP,
    userCredentialControllerObject.authenticateCredentialNonFasyankes)
router.post('/api/rslogin', 
    userIPControllerObject.authenticateIP, 
    userCredentialControllerObject.authenticateCredentialFasyankes)

// Consumer IP Address
router.post('/api/consipaddress', consumerIPAddressControllerObject.store)
router.get('/api/consipaddress', consumerIPAddressControllerObject.index)
router.patch('/api/consipaddress/:id', consumerIPAddressControllerObject.update)

// Rumah Sakit
router.get('/api/rumahsakit', 
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken, 
    RumahSakitControllerObject.index)
router.get('/api/rumahsakit/:id', 
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    RumahSakitControllerObject.show)

// Ketersediaan Tempat Tidur
router.get('/api/ketersediaantempattidur', 
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    KetersediaanTempatTidurControllerObject.index)

// Ketersediaan Nakes
router.get('/api/ketersediaannakes', 
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken, 
    KetersediaanNakesControllerObject.index)
router.post('/api/ketersediaannakes', 
    userTokenObject.authenticateToken, 
    KetersediaanNakesControllerObject.store)
router.patch('/api/ketersediaannakes/:id', 
    userTokenObject.authenticateToken,
    KetersediaanNakesControllerObject.update)

// Ketersediaan Alkes
router.get('/api/ketersediaanalkes', 
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken, 
    KetersediaanAlkesControllerObject.index)

// Ketersediaan Pelayanan
router.get('/api/ketersediaanpelayanan', 
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken, 
    KetersediaanPelayananControllerObject.index)

// Klaim BPJS 1
router.get('/api/klaimbpjs1', 
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    KlaimBPJS1ControllerObject.index)

// Klaim BPJS 2
router.get('/api/klaimbpjs2', 
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    KlaimBPJS2ControllerObject.index)

// Klaim BPJS 3
router.get('/api/klaimbpjs3',
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    KlaimBPJS3ControllerObject.index)

// Klaim BPJS 4
router.get('/api/klaimbpjs4',
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    KlaimBPJS4ControllerObject.index)

// Klaim BPJS 5
router.get('/api/klaimbpjs5',
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    KlaimBPJS5ControllerObject.index)

// Klaim KemKes
router.get('/api/klaimkemkes', 
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken, 
    KlaimKemKesControllerObject.index)

// Kematian
router.post('/api/kematian', rsTokenObject.authenticateToken,KematianControllerObject.store)
router.get('/api/kematian', rsTokenObject.authenticateToken, KematianControllerObject.index)
router.patch('/api/kematian/:id', rsTokenObject.authenticateToken, KematianControllerObject.update)
router.delete('/api/kematian/:id', rsTokenObject.authenticateToken, KematianControllerObject.destroy)

// Lokasi Kematian
router.get('/api/lokasikematian', 
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    LokasiKematianControllerObject.index)

// Penyebab Kematian
router.get('/api/penyebabkematian',
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    PenyebabKematianControllerObject.index
)

// Penyebab Kematian Langsung
router.get('/api/penyebabkematianlangsung', 
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    PenyebabKematianLangsungControllerObject.index)

// Status Pasien Saat Meninggal
router.get('/api/statuspasiensaatmeninggal', 
    rsTokenObject.authenticateToken, 
    StatusPasienSaatMeninggalControllerObject.index)

// Komorbid
router.get('/api/komorbid',
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    KomorbidControllerObject.index)

// Komorbid CoInsiden
router.get('/api/komorbidcoinsiden',
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    KomorbidCoInsidenControllerObject.index
)

// Kelompok Gejala
router.get('/api/kelompokgejala', 
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    KelompokGejalaControllerObject.index)

// Jenis Pemeriksaan Lab
router.get('/api/jenispemeriksaanlab', 
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken, 
    JenisPemeriksaanLabControllerObject.index)

// Varian Covid
router.get('/api/variancovid', 
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken, 
    VarianCovidControllerObject.index )

// Provinsi
router.get('/api/provinsi',
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken, 
    ProvinsiControllerObject.index)

// KabKota
router.get('/api/kabkota', 
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    KabKotaControllerObject.index)

// Kecamatan
router.get('/api/kecamatan', 
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    KecamatanControllerObject.index)

// Kelurahan
router.get('/api/kelurahan',
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    KelurahanControllerObject.index)

// Laporan Covid 19 Versi 3
router.post('/api/laporancovid19versi3', 
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    LaporanCovid19Versi3ControllerObject.store)
router.get('/api/laporancovid19versi3', 
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    LaporanCovid19Versi3ControllerObject.index)
router.get('/api/laporancovid19versi3/:id', 
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    LaporanCovid19Versi3ControllerObject.show)
router.patch('/api/laporancovid19versi3/:id', 
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    LaporanCovid19Versi3ControllerObject.update )

// Laporan Covid 19 Versi 3 Diagnosa
router.post('/api/laporancovid19versi3diagnosa', 
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    LaporanCovid19Versi3DiagnosaControllerObject.store)
router.get('/api/laporancovid19versi3diagnosa', 
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    LaporanCovid19Versi3DiagnosaControllerObject.index)
router.get('/api/laporancovid19versi3diagnosa/:id', 
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    LaporanCovid19Versi3DiagnosaControllerObject.show)
router.patch('/api/laporancovid19versi3diagnosa/:id', 
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    LaporanCovid19Versi3DiagnosaControllerObject.update )

// Laporan Covid 19 Versi 3 Komorbid
router.post('/api/laporancovid19versi3komorbid', 
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    LaporanCovid19Versi3KomorbidControllerObject.store)
router.get('/api/laporancovid19versi3komorbid', 
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    LaporanCovid19Versi3KomorbidControllerObject.index)
router.get('/api/laporancovid19versi3komorbid/:id', 
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    LaporanCovid19Versi3KomorbidControllerObject.show)
router.patch('/api/laporancovid19versi3komorbid/:id', 
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    LaporanCovid19Versi3KomorbidControllerObject.update )

// Laporan Covid 19 Versi 3 Terapi
router.post('/api/laporancovid19versi3terapi', 
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    LaporanCovid19Versi3ObatControllerObject.store)
router.get('/api/laporancovid19versi3terapi', 
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    LaporanCovid19Versi3ObatControllerObject.index)
router.get('/api/laporancovid19versi3terapi/:id', 
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    LaporanCovid19Versi3ObatControllerObject.show)
router.patch('/api/laporancovid19versi3terapi/:id', 
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    LaporanCovid19Versi3ObatControllerObject.update)

// Laporan Covid 19 Versi 3 Vaksinasi
router.post('/api/laporancovid19versi3vaksinasi', 
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    LaporanCovid19Versi3VaksinasiControllerObject.store)
router.get('/api/laporancovid19versi3vaksinasi', 
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    LaporanCovid19Versi3VaksinasiControllerObject.index)
router.get('/api/laporancovid19versi3vaksinasi/:id', 
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    LaporanCovid19Versi3VaksinasiControllerObject.show)
router.patch('/api/laporancovid19versi3vaksinasi/:id', 
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    LaporanCovid19Versi3VaksinasiControllerObject.update)

// Laporan Covid 19 Versi 3 Pemeriksaan Lab
router.post('/api/laporancovid19versi3pemeriksaanlab', rsTokenObject.authenticateToken,
    LaporanCovid19Versi3PemeriksaanLabControllerObject.store)
router.get('/api/laporancovid19versi3pemeriksaanlab', rsTokenObject.authenticateToken,
    LaporanCovid19Versi3PemeriksaanLabControllerObject.index)
router.get('/api/laporancovid19versi3pemeriksaanlab/:id', rsTokenObject.authenticateToken,
    LaporanCovid19Versi3PemeriksaanLabControllerObject.show)

// Laporan Covid 19 Versi 3 Status Keluar
router.post('/api/laporancovid19versi3statuskeluar', 
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    LaporanCovid19Versi3StatusKeluarControllerObject.store)

// Kewarganegaraan
router.get('/api/kewarganegaraan', 
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    KewarganegaraanControllerOject.index)

// Asal Pasien
router.get('/api/asalpasien', 
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    AsalPasienControllerObject.index)

// Status Vaksinasi
router.get('/api/statusvaksinasi', 
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    StatusVaksinasiControllerObject.index)

// Jenis Pasien
router.get('/api/jenispasien', 
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,  
    JenisPasienControllerObject.index)

// Pekerjaan
router.get('/api/pekerjaan', 
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    PekerjaanControllerObject.index)

// Status Pasien
router.get('/api/statuspasien', 
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    StatusPaseinControllerObject .index)

// Status Rawat
router.get('/api/statusrawat', 
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    StatusRawatControllerObject.index)

// Terapi
router.get('/api/terapi', 
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    ObatControllerObject.index)

// Status Keluar
router.get('/api/statuskeluar', 
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    StatusKeluarControllerObject.index)

// Dosis Vaksin
router.get('/api/dosisvaksin', 
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    DosisVaksinControllerObject.index)

// Jenis Vaksin
router.get('/api/jenisvaksin', 
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    JenisVaksinControllerObject.index)

// Alat Oksigen
router.get('/api/alatoksigen', 
    userIPControllerObject.authenticateIP,
    userTokenObject.authenticateToken,
    AlatOksigenControllerObject.index)

router.use('/api', (req, res) => {
    res.status(404).send({
        status: false,
        message: 'page not found'
    });
})

module.exports = router