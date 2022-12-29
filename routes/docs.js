const express = require('express')
const router = express.Router()

const swaggerUi = require('swagger-ui-express')
const apiDoc2022021621 = require('../documentations/apiDoc2022021621.json')
const apiDoc2022052021 = require('../documentations/apiDoc2022052021.json')
const apiDoc2022111715 = require('../documentations/apiDoc2022111715.json')
const apiDocNakes = require('../documentations/apiDocNakes.json')
const apiDocRSOnlineRS = require('../documentations/apiDocRSOnlineRS.json')
const apiDoc2022122910 = require('../documentations/apiDoc2022122910.json')


router.use('/apidoc2022021621', swaggerUi.serve, (req, res) => {
    let html = swaggerUi.generateHTML(apiDoc2022021621);
    res.send(html);
})

router.use('/apiDoc2022111715', swaggerUi.serve, (req, res) => {
    let html = swaggerUi.generateHTML(apiDoc2022111715);
    res.send(html);
})

router.use('/apidoc2022052021', swaggerUi.serve, (req, res) => {
    let html = swaggerUi.generateHTML(apiDoc2022052021);
    res.send(html);
})

router.use('/apiDoc2022122910', swaggerUi.serve, (req, res) => {
    let html = swaggerUi.generateHTML(apiDoc2022122910);
    res.send(html);
})

router.use('/apidocnakes', swaggerUi.serve, (req, res) => {
    let html = swaggerUi.generateHTML(apiDocNakes);
    res.send(html);
})

router.use('/apidocrsonliners', swaggerUi.serve, (req, res) => {
    let html = swaggerUi.generateHTML(apiDocRSOnlineRS);
    res.send(html);
})


module.exports = router