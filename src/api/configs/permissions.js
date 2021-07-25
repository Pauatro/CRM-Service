const actions = require('./actions')

module.exports = {
    admin:{
        [actions.retrieveAllCustomers]: true,
        [actions.retrieveCustomerById]: true,
        [actions.registerCustomer]: true,
        [actions.updateCustomer]: true,
        [actions.deleteCustomer]: true,
        [actions.retrieveAllUsers]: true,
        [actions.registerUser]: true,
        [actions.deleteUser]: true,
        [actions.updateUser]: true,
        [actions.updateUserStatus]: true,
    },
    user: {
        [actions.retrieveAllCustomers]: true,
        [actions.retrieveCustomerById]: true,
        [actions.registerCustomer]: true,
        [actions.updateCustomer]: true,
        [actions.deleteCustomer]: true,
    }
}