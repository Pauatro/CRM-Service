/**
 * Updates user with introduced email if it exists
 * 
 * @param {string} id The user id. 
 * @param {string} status The user's new status. 
 * 
 * @throws {TypeError} If any of the parameters does not match the corresponding type.
 * @throws {VoidError} If any of the parameters expected to be a string is an empty string.
 * @throws {NonExistenceError} If the user does not exist in the database.
 */

require('../commons/polyfills/string')
require('../commons/polyfills/json')
const { errors: { NonExistenceError } } = require('../commons')
const { models: { User }, configs: { userStatuses } } = require('../data')
const bcrypt = require('bcryptjs')

module.exports = (id, status) => {
    String.validate.notVoid(id)
    String.validate.isInList(status, Object.values(userStatuses))
    
    return (async () => {
        const user = await User.findById(id)

        if (!user) throw new NonExistenceError(`the requested user does not exist`)

        await User.updateOne({ _id: id }, { status })
    })()
}