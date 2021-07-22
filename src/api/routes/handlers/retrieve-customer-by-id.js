const { retrieveCustomerById } = require('../../../logic')
const { handleError } = require('../../helpers')

module.exports = (req, res) => {
    try {
        const { params: { id } } = req
        retrieveCustomerById(id)
            .then(user => res.status(200).send({user}))
            .catch(error => handleError(error, res))
    } catch (error) {
        handleError(error, res)
    }
}