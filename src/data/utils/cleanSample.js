const cleanId = require('./cleanId.js')

module.exports = element=>{
    if(element.__v !== undefined) delete element["__v"]
    return cleanId(element)
}