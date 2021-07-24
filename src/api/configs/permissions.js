const actions = require('./actions')

module.exports = {
    admin:{
        [actions.retrieveAllCustomers]: true,
        retrieveCustomerById: true,
        registerCustomer: true,
        updateCustomer: true,
        deleteCustomer: true,
        retrieveAllUsers: true,
        registerUser: true,
        deleteUser: true,
        updateUser: true,
        updateUserStatus: true,
    },
    user: {
        retrieveAllCustomers: true,
        retrieveCustomerById: true,
        registerCustomer: true,
        updateCustomer: true,
        deleteCustomer: true,
    }
}