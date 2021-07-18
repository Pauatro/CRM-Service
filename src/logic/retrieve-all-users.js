/**
 * Returns all user emails and statuses.
 */

const { models: { User } } = require('../data')

const cleanUser = user=>{
    const id = user._id
    delete user._id
    return {...user, id}
}
 
module.exports = () => {
    return (async () => {
        const users = await User.find({}, 'id email status').lean().then(users=>users.map(cleanUser));
        return users
    })()
}