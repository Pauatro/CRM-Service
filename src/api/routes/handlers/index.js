module.exports = {
    registerUser: require('./register-user'),
    authenticateUser: require('./authenticate-user'),
    deleteUser: require('./delete-user'),
    confirmSession: require('./confirm-session'),
    retrieveAllUsers: require('./retrieve-all-users'),
    updateUserStatus: require('./update-user-status'),
    updateUserEmail: require('./update-user-email'),
    registerCustomer: require('./register-customer'),
    deleteCustomer: require('./delete-customer'),
    updateCustomer: require('./update-customer'),
    retrieveAllCustomers: require('./retrieve-all-customers'),
    retrieveCustomerById: require('./retrieve-customer-by-id')
}