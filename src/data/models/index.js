const { model } = require('mongoose')
const {  admin, user } = require('./schemas')

module.exports = {
    Admin: model('Admin', admin),
    User: model('User', user)
}