const { env: { SECRET } } = process

const express = require('express')
const { Router } = express
const { authenticateUser, confirmSession, registerUser, deleteUser, retrieveAllUsers, updateUserStatus } = require('./handlers')
const { jwtVerifierExtractor } = require('../middlewares')
const { handleError } = require('../helpers')

const parseBody = express.json()
const verifyExtractJwt = jwtVerifierExtractor(SECRET, handleError)

const api = new Router()

api.post('/users', parseBody, registerUser)

api.get('/users', parseBody, retrieveAllUsers)

api.delete('/users/:id', parseBody, deleteUser)

api.put('/users/:id', parseBody, updateUserStatus)

api.post('/users/auth', parseBody, authenticateUser)

api.post('/users/auth/confirm', verifyExtractJwt, confirmSession)

module.exports = {
    api
}