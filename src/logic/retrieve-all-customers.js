/**
 * Returns all customer names, surnames, ids and urls.
 */

 const { models: { Customer }, utils: {cleanId} } = require('../data')
 
 module.exports = () => {
     return (async () => {
         const customers = await Customer.find({}, 'id name surname photo').lean().then(customers=>customers.map(cleanId));
         return customers
     })()
 }