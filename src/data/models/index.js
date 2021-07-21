const { model } = require('mongoose');
const { user, customer } = require('./schemas');

module.exports = {
	User: model('User', user),
	Customer: model('Customer', customer),
};
