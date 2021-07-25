const { retrieveAllCustomers } = require('../../../logic')
const { handleError } = require('../../helpers')

module.exports = (req, res) => {
    try {
        retrieveAllCustomers()
            .then((customers) => res.status(200).send({customers}))
            .catch(error => handleError(error, res))
    } catch (error) {
        handleError(error, res)
    }
}