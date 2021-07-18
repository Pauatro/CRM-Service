const buildError = require('./error-builder')

module.exports = {
    DuplicityError: buildError('DuplicityError'),
    VoidError: buildError('VoidError'),
    NonExistenceError: buildError('NonExistenceError'),
    CredentialsError: buildError('CredentialsError'),
    ValueError: buildError('ValueError')
}