/**
 * Checks user credentials and compares them with the user in the database.
 * 
 * @param {string} email The user e-mail. 
 * @param {string} password The user password.
 * @param {string} status The user status.
 * 
 * @throws {TypeError} If any of the parameters does not match the corresponding type.
 * @throws {VoidError} If any of the parameters expected to be a string is an empty string.
 * @throws {DuplicityError} If a user with the same email already exists in the database
 * @throws {Error} If e-mail does not match the expected format.
 */

require('../commons/polyfills/string')
require('../commons/polyfills/json')
const { utils: { Email }, errors: { DuplicityError } } = require('../commons')
const { configs: { userStatuses }, models: { User } } = require('../data')
const bcrypt = require('bcryptjs')

module.exports = (email, password, status) => {
    String.validate.isInList(status, Object.values(userStatuses))
    String.validate.notVoid(email)
    Email.validate(email)
    String.validate.notVoid(password)

    return (async () => {
        const user = await User.findOne({ email })

        if (user) throw new DuplicityError(`Invalid Email`)

        const hash = await bcrypt.hash(password, 10)

        await User.create({ email, password: hash, status })
        return
    })()
}