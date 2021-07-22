const { registerCustomer } = require('../../../logic')
const { handleError } = require('../../helpers')

module.exports = (req, res) => {
    try {
        const { body: { name, surname }, payload: { sub } } = req

        registerCustomer( name, surname, sub)
            .then(() => res.status(200).send())
            .catch(error => handleError(error, res))
    } catch (error) {
        handleError(error, res)
    }
}