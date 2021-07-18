require('../commons/polyfills/string')
require('../commons/polyfills/json')
const { utils: { Email }, errors: { NonExistenceError } } = require('../commons')
const { models: { User } } = require('../data')
const bcrypt = require('bcryptjs')

module.exports = (email) => {
    String.validate.notVoid(email)
    Email.validate(email)

    return (async () => {
        const user = await User.find({ email })

        if (!user) throw new NonExistenceError(`user with email ${email} does not exist`)

        await User.deleteOne({ email })
    })()
}