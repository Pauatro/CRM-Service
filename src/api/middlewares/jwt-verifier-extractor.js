const { utils: { jwtPromised } } = require('../../commons')
const { handleError } = require('../helpers');

module.exports = (secret) =>
    (req, res, next) => {
        try {
            const [, token] = req.header('authorization').split(' ')

            jwtPromised.verify(token, secret)
                .then(payload => {
                    req.payload = payload
                    next()
                })
                .catch(error => handleError(error, res))
        } catch (error) {
            handleError(error, res)
        }
    }