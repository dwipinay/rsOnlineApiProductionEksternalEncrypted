require('dotenv').config()

const bcrypt = require('bcrypt')
const saltRound = 10
const user = require('../models/User')
const jwt = require('jsonwebtoken')
const dateFormat = require("dateformat");
const Joi = require('joi')

class userController {
    index(req, res) {
        user.getAll((err, results) => {
            if (err) {
                res.status(404).send({
                    status: false,
                    message: err
                });
                return;
            }
            if(results.length == 0){
                res.status(404).send({
                    status: false,
                    message: 'data not found'
                });
                return;
            }
            res.status(200).send({
                status: true,
                message: 'data found',
                data: results
            });
        })
    }
    
    store(req, res) {
        const schema = Joi.object({
            name: Joi.string()
                .min(3)
                .required(),
                
            email: Joi.string()
                .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'id'] } })
                .required(),
            
            password: Joi.string()
                .required(),

            password_confirmation: Joi.string()
                .required()
                .valid(Joi.ref('password')),
            
            app_name: Joi.string()
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

        // res.send(value);

        bcrypt.hash(req.body.password, saltRound, (err, hash) => {
            const data = {
                name: req.body.name,
                email: req.body.email,
                password: hash,
                app_name: req.body.app_name,
                kode_rs: req.body.kode_rs
            }
            if (err) {
                res.status(422).send({
                    status: false,
                    message: err
                })
                return
            }

            const userObject = new user()
            userObject.insertData(data, (err, result) => {
                if (err) {
                    res.status(422).send({
                        status: false,
                        message: err
                    })
                    return
                }
                res.status(201).send({
                    status: true,
                    message: "data created",
                    data: {
                        id: result.insertId,
                        name: data.name,
                        email: data.email,
                        app_name: data.app_name,
                        kode_rs: data.kode_rs
                    }
                })
            })
        })
    }

    findByCredential(req, res) {
        const data = {
            email: req.body.email,
            password: req.body.password
        }

        const userObject = new user()
        userObject.findByCredential(data, (err, result) => {
            if (err) {
                res.status(422).send({
                    status: false,
                    message: err
                })
                return
            }
            if(!result.length) {
                res.status(401).send({
                    status:false,
                    message: "Unauthorized"
                })
                return
            }
            bcrypt.compare(req.body.password, result[0].password, (err2, res2) => {
                if(res2 == false) {
                    res.status(401).send({
                        status: false,
                        message: 'Unauthorized'
                    })
                    return;
                }
                // const user = JSON.parse(JSON.stringify(results[0]))
                const payloadObject = {
                    email: result[0].email,
                    kode_rs: result[0].kode_rs
                }
                const accessToken = jwt.sign(payloadObject, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRESIN})
                jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
                    // console.log(user)
                    const refreshToken = jwt.sign(payloadObject, process.env.REFRESH_TOKEN_SECRET)
                    const iat = dateFormat(new Date(user.iat * 1000), "yyyy-mm-dd hh:MM:ss TT Z")
                    const exp = dateFormat(new Date(user.exp * 1000), "yyyy-mm-dd hh:MM:ss TT Z")
                    res.status(201).send({
                        status: true,
                        message: "access token created",
                        data: {
                            access_token: accessToken,
                            issued_at: iat,
                            expired_at: exp,
                            expires_in: process.env.ACCESS_TOKEN_EXPIRESIN
                        }
                    })
                })
            })
        })
    }
    
    createToken(req, res) {
        const refreshToken = req.body.token
        if (refreshToken == null) return res.sendStatus(401)
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403)
            console.log(user)
            const email = {
                email: user.email
            }
            const accessToken = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRESIN})
            jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err2, user2) => {
                console.log(user)
                const iat = dateFormat(new Date(user2.iat * 1000), "yyyy-mm-dd hh:MM:ss TT Z")
                const exp = dateFormat(new Date(user2.exp * 1000), "yyyy-mm-dd hh:MM:ss TT Z")
                res.send(
                    { 
                        accessToken: accessToken,
                        issuedAt: iat,
                        expiredAt: exp,
                        expiredIn: process.env.ACCESS_TOKEN_EXPIRESIN
                    }
                )
            })
        })
    }
    
}

module.exports = userController