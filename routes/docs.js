const express = require('express')
const router = express.Router()

const swaggerUi = require('swagger-ui-express')
// const apiDeathDoc = require('../documentations/apiDeathDoc.json')
const apiDoc2022021621 = require('../documentations/apiDoc2022021621.json')
// const apiDocKlaim1 = require('../documentations/apiDocKlaim1.json')
const apiDocNakes = require('../documentations/apiDocNakes.json')
const apiDocRSOnlineRS = require('../documentations/apiDocRSOnlineRS.json')

router.use('/apidoc2022021621', swaggerUi.serve, (req, res) => {
    let html = swaggerUi.generateHTML(apiDoc2022021621);
    res.send(html);
})

// router.use('/apidocklaim1', swaggerUi.serve, (req, res) => {
//     let html = swaggerUi.generateHTML(apiDocKlaim1);
//     res.send(html);
// })

router.use('/apidocnakes', swaggerUi.serve, (req, res) => {
    let html = swaggerUi.generateHTML(apiDocNakes);
    res.send(html);
})

router.use('/apidocrsonliners', swaggerUi.serve, (req, res) => {
    let html = swaggerUi.generateHTML(apiDocRSOnlineRS);
    res.send(html);
})


module.exports = router