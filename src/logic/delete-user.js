/**
 * Deletes user with introduced id if it exists
 * 
 * @param {string} id Id of the user to be deleted. 
 * 
 * @throws {TypeError} If any of the parameters does not match the corresponding type.
 * @throws {VoidError} If any of the parameters expected to be a string is an empty string.
 * @throws {NonExistenceError} If the user does not exist in the database.
 */

require('../commons/polyfills/string')
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