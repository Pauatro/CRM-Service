const { updateCustomerPhoto } = require('../../../logic')
const { handleError } = require('../../helpers')

module.exports = (req, res) => {
    try {
        const { payload: { sub }, params: { id } } = req
        let body = []
        req.on('data', (chunk)=>{
            body.push(chunk)
        }).on('end',()=>{
            const content = Buffer.concat(body)

            updateCustomerPhoto(id, sub, content)
                .then((url) => res.status(200).send({ url }))
                .catch(error => handleError(error, res))
        })
    } catch (error) {
        handleError(error, res)
    }
}