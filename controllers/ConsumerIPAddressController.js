const consumerIPAddress = require('../models/ConsumerIPAddress')
const Joi = require('joi')

class ConsumerIPAddressController {
    index(req, res) {
        const consumerIPAddressObject = new consumerIPAddress()
        consumerIPAddressObject.getData((error, results) => {
            if (error) {
                return res.status(422).send({
                    status: false,
                    message: error
                })
            }
            res.status(200).send({
                status: true,
                message: "data found",
                data: results
            })
        })
    }

    store(req, res) {
        const schema = Joi.object({
            ip_address: Joi.string()
                .required(),

            owner: Joi.string()
                .required()
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
            ip_address: req.body.ip_address,
            owner: req.body.owner
        }

        const consumerIPAddressObject = new consumerIPAddress()
        consumerIPAddressObject.insertData(data, (err, result) => {
            if (err) {
                res.status(422).send({
                    status: false,
                    message: err
                })
                return
            }
            res.status(201).send({
                status: true,
                message: "data created"
            })
        })
    }

    update(req, res) {
        const schema = Joi.object({
            ip_address: Joi.string()
                .required()
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
            id: req.params.id,
            ip_address: req.body.ip_address
        }

        const consumerIPAddressObject = new consumerIPAddress()
        consumerIPAddressObject.updateData(data, (err, results) => {
            if (err) {
                res.status(422).send({
                    status: false,
                    message: err
                })
                return
            }
            res.status(200).send({
                status: true,
                message: "data updated",
                data: results
            })
        })
    }

    findByIPAddress(req, res, next) {
        const requestIP = req.socket.remoteAddress.toString().replace('::ffff:', '')
        const consumerIPAddressObject = new consumerIPAddress()
        consumerIPAddressObject.findByIPAddress(requestIP, (err, result) => {
            if (err) {
                res.status(422).send({
                    status: false,
                    message: err
                })
                return
            }
            if(result.length) { 
                next()
            } else {
                res.status(403).send({
                    status: false,
                    message: `${requestIP} not registered`
                })
            }
        })
    }
}

module.exports = ConsumerIPAddressController