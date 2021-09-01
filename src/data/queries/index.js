const {
    deleteFile,
    uploadFile
} = require('./files')

const {
    findCustomerById,
    deleteCustomerById,
    createCustomer
} = require('./customers')

const {
    findUserById,
    deleteUserById
} = require('./users')

module.exports = {
    deleteFile,
    uploadFile,
    findCustomerById,
    deleteCustomerById,
    createCustomer,
    findUserById,
    deleteUserById,
}