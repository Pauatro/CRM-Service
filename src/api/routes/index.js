const { env: { SECRET } } = process

const { Router } = require('express')
const { authenticateUser, confirmSession, registerUser } = require('./handlers')
const bodyParser = require('body-parser')
const { jwtVerifierExtractor } = require('../middlewares')
const { handleError } = require('../helpers')

const parseBody = bodyParser.json()
const verifyExtractJwt = jwtVerifierExtractor(SECRET, handleError)

const api = new Router()


api.post('/users', parseBody, registerUser)

api.post('/users/auth', parseBody, authenticateUser)

api.post('/users/auth/confirm', verifyExtractJwt, confirmSession)

module.exports = {
    api
}