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
	retrieveCustomerById,
} = require('./handlers');
const {
	jwtVerifierExtractor,
	rolePermissionsChecker,
} = require('../middlewares');
const { actions } = require('../configs');

const parseBody = express.json();
const verifyExtractJwt = jwtVerifierExtractor(SECRET);

const api = new Router();

api.post(
	'/users',
	verifyExtractJwt,
	parseBody,
	rolePermissionsChecker(actions.registerUser),
	registerUser
);
api.get(
	'/users',
	verifyExtractJwt,
	parseBody,
	rolePermissionsChecker(actions.retrieveAllUsers),
	retrieveAllUsers
);
api.delete(
	'/users/:id',
	verifyExtractJwt,
	parseBody,
	rolePermissionsChecker(actions.deleteUser),
	deleteUser
);
api.put(
	'/users/:id/status',
	verifyExtractJwt,
	parseBody,
	rolePermissionsChecker(actions.updateUserStatus),
	updateUserStatus
);
api.put(
	'/users/:id',
	verifyExtractJwt,
	parseBody,
	rolePermissionsChecker(actions.updateUserEmail),
	updateUserEmail
);
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
