const { updateUserEmail } = require('../../../logic')
const { handleError } = require('../../helpers')

module.exports = (req, res) => {
    try {
        const { params: { id }, body: { email } } = req
        console.log(email)
        updateUserEmail( id, email )
            .then(() => res.status(200).send())
            .catch(error => handleError(error, res))
    } catch (error) {
        handleError(error, res)
    }
}
