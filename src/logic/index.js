module.exports = {
    context: require('./context'),
    registerUser: require('./register-user'),
    registerCustomer: require('./register-customer'),
    deleteUser: require('./delete-user'),
    authenticateUser: require('./authenticate-user'),
    updateUserStatus: require('./update-user-status'),
    updateUserEmail: require('./update-user-email'),
    retrieveAllUsers: require('./retrieve-all-users')
}