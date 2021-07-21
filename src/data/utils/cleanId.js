module.exports = element=>{
    const id = element._id
    delete element._id
    return {...element, id}
}