const jwt = require('jsonwebtoken')


module.exports = (req, res, next) => {
    const token = req.headers.authorization
    const secret = process.env.JWT_SECRET || 'is it a good secret'
    if(token){
        jwt.verify(token, secret, (err, decodedToken) => {
            if(err) {
                res.status(401).json({message: "You shall not pass"})
            } else {
                req.jwt = decodedToken
                next()
            }
        })
    } else {
        res.status(401).json({message: 'These are not the tokens you are looking for'})
    }
}