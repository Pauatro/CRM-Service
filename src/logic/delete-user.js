/**
 * Deletes user with introduced id if it exists
 * 
 * @param {string} id The user id. 
 * 
 * @throws {TypeError} If any of the parameters does not match the corresponding type.
 * @throws {VoidError} If any of the parameters expected to be a string is an empty string.
 * @throws {NonExistenceError} If the user does not exist in the database.
 * @throws {Error} If e-mail does not match the expected format.
 */

require('../commons/polyfills/string')
require('../commons/polyfills/json')
const { errors: { NonExistenceError } } = require('../commons')
const { models: { User } } = require('../data')

module.exports = (id) => {
    String.validate.notVoid(id)

    return (async () => {
        const user = await User.findById(id)

        if (!user) throw new NonExistenceError(`the requested user does not exist`)

        await User.deleteOne({_id: id})
    })()
}