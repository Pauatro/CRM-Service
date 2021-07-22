const {
	env: { SECRET },
} = process;

const express = require('express');
const { Router } = express;
const {
	authenticateUser,
	confirmSession,
	registerUser,
	deleteUser,
	retrieveAllUsers,
	updateUserStatus,
	updateUserEmail,
	registerCustomer,
	deleteCustomer,
	updateCustomer,
	retrieveAllCustomers,
	retrieveCustomerById
} = require('./handlers');
const { jwtVerifierExtractor } = require('../middlewares');
const { handleError } = require('../helpers');

const parseBody = express.json();
const verifyExtractJwt = jwtVerifierExtractor(SECRET, handleError);

const api = new Router();

api.post('/users', parseBody, registerUser);
api.get('/users', parseBody, retrieveAllUsers);
api.delete('/users/:id', parseBody, deleteUser);
api.put('/users/:id/status', parseBody, updateUserStatus);
api.put('/users/:id', parseBody, updateUserEmail);
api.post('/users/auth', parseBody, authenticateUser);
api.post('/users/auth/confirm', verifyExtractJwt, confirmSession);

api.post('/customers', verifyExtractJwt, parseBody, registerCustomer);
api.delete('/customers/:id', verifyExtractJwt, parseBody, deleteCustomer);
api.put('/customers/:id', verifyExtractJwt, parseBody, updateCustomer);
api.get('/customers', verifyExtractJwt, parseBody, retrieveAllCustomers);
api.get('/customers/:id', verifyExtractJwt, parseBody, retrieveCustomerById);

module.exports = {
	api,
};
