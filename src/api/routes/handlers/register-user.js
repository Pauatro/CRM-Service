const { configs: {userStatuses} } = require('../../../data')
const { registerUser } = require('../../../logic')
const { handleError } = require('../../helpers')

module.exports = (req, res) => {
    try {
        const { body: { email, password } } = req
        registerUser( email, password, userStatuses.user)
            .then(() => res.status(200).send())
            .catch(error => handleError(error, res))
    } catch (error) {
        handleError(error, res)
    }
}