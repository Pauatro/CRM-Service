const { env: { SECRET } } = process

const { Router } = require('express')
const { registerAdmin, authenticateAdmin, confirmSession } = require('./handlers')
const bodyParser = require('body-parser')
const { jwtVerifierExtractor } = require('../middlewares')
const { handleError } = require('../helpers')

const parseBody = bodyParser.json()
const verifyExtractJwt = jwtVerifierExtractor(SECRET, handleError)

const api = new Router()

api.post('/admins', parseBody, registerAdmin)

api.post('/admins/auth', parseBody, authenticateAdmin)

api.post('/admins/auth/confirm', verifyExtractJwt, confirmSession)

module.exports = {
    api
}