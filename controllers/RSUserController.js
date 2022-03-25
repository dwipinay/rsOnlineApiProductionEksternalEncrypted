const bcrypt = require('bcrypt')
const rsUser = require('../models/RSUser')
const jwt = require('jsonwebtoken')
const dateFormat = require("dateformat");

class RSUserController {
    findByCredential(req, res) {
        const data = {
            kode_rs: req.body.kode_rs,
            password: req.body.password
        }
        const rsUserObject = new rsUser()
        rsUserObject.findByCredential(data, (err, result) => {
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
}

module.exports = RSUserController