/**
 * Deletes customer with introduced id if it exists
 * 
 * @param {string} id Id of the customer to be deleted. 
 * 
 * @throws {TypeError} If any of the parameters does not match the corresponding type.
 * @throws {VoidError} If any of the parameters expected to be a string is an empty string.
 * @throws {NonExistenceError} If the customer does not exist in the database.
 * @throws {Error} If e-mail does not match the expected format.
 */

require('../commons/polyfills/string')
require('../commons/polyfills/json')
const { errors: { NonExistenceError } } = require('../commons')
const { queries: {findCustomerById, deleteCustomerById} } = require('../data')

module.exports = (id) => {
    String.validate.notVoid(id)

    return (async () => {
        const customer = await findCustomerById(id)

        if (!customer) throw new NonExistenceError(`the requested customer does not exist`)

        await deleteCustomerById(id)
    })()
}