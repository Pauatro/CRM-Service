const { retrieveAllCustomers } = require('../../../logic')
const { handleError } = require('../../helpers')

module.exports = (req, res) => {
    try {
        retrieveAllCustomers()
            .then((users) => res.status(200).send({users}))
            .catch(error => handleError(error, res))
    } catch (error) {
        handleError(error, res)
    }
}