const { model } = require('mongoose')
const { term, admin, predictorInput, predictorOutput, predictedItem, symptom, submittedTerm, navigationItem, symptomList } = require('./schemas')

module.exports = {
    Admin: model('Admin', admin),
}