const jwt = require('jsonwebtoken')

class Token {
    authenticateToken(request, res, next) {
        const authHeader = request.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if (token == null) return res.status(401).send({
            status: false,
            message: 'Unauthorized'
        })
    
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err){
                res.status(403).send({
                    status: false,
                    message: 'Forbidden'
                })
                return
            }
            // console.log(user)
            request.user = user
            next()
        })
    }
}

module.exports = Token