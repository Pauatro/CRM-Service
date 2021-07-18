const { updateUserStatus } = require('../../../logic')
const { handleError } = require('../../helpers')

module.exports = (req, res) => {
    try {
        const { params: { id }, body: { status } } = req
        
        updateUserStatus( id, status )
            .then(() => res.status(200).send())
            .catch(error => handleError(error, res))
    } catch (error) {
        handleError(error, res)
    }
}
