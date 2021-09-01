const { models: { Customer } } = require('../../data')

const findCustomerById = (id)=>{
    return Customer.findById(id)
}

const deleteCustomerById = (id)=>{
    return Customer.deleteOne({_id: id})
}

const createCustomer = (name, surname, createdBy)=>{
    return Customer.create({ name, surname, createdBy: userId })
}

module.exports = {
    findCustomerById,
    deleteCustomerById,
    createCustomer
}