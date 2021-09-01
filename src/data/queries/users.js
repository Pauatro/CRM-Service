const { models: { User } } = require('../../data')

const findUserById = (id)=>{
    return User.findById(id)
}

const findUserByEmail = (email)=>{
    return User.findOne({ email })
}

const deleteUserById = (id)=>{
    return User.deleteOne({_id: id})
}

module.exports = {
    findUserById,
    deleteUserById,
    findUserByEmail
}