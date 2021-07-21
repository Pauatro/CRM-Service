/**
 * Returns all user emails and statuses.
 */

const { models: { User }, utils: {cleanId} } = require('../data')
 
module.exports = () => {
    return (async () => {
        const users = await User.find({}, 'id email status').lean().then(users=>users.map(cleanId));
        return users
    })()
}