const { errors: { DuplicityError, VoidError, NonExistenceError, CredentialsError } } = require('../../commons')
const { JsonWebTokenError } = require('jsonwebtoken')

module.exports = function (error, res) {
    let status = 500

    switch (true) {
        case error instanceof TypeError || error instanceof VoidError:
            status = 406
            break
        case error instanceof DuplicityError || error instanceof NonExistenceError:
            status = 409
            break
        case error instanceof CredentialsError || error instanceof JsonWebTokenError:
            status = 401
            break
    }

    res.status(status).json({ error: error.message })
}