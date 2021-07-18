require('dotenv').config()

const { env: { TEST_MONGODB_URL: MONGODB_URL } } = process
const authenticateUser = require('./authenticate-user')
const { random } = Math
const { expect } = require('chai')
require('../commons/polyfills/json')
const { mongoose, models: { User }, configs: {userStatuses}  } = require('../data')
const bcrypt = require('bcryptjs')
const { errors: { NonExistenceError, VoidError, CredentialsError } } = require('../commons')

describe('server logic - authenticate user', () => {
    before(() => mongoose.connect(MONGODB_URL))

    let email, password, userId, hash

    beforeEach(() =>
        User.deleteMany()
            .then(() => {
                email = `e-${random()}@mail.com`
                password = `password-${random()}`

                return bcrypt.hash(password, 10)
            })
            .then(_hash => hash = _hash)
    )

    describe('when user already exists', () => {
        beforeEach(() =>
            User.create({ email, password: hash, status: userStatuses.user })
                .then(user => userId = user.id)
        )

        it('should succeed on correct credentials', () =>
            authenticateUser(email, password)
                .then(_userId => expect(_userId).to.equal(userId))
        )

        it('should fail on wrong password', () => {
            password += 'wrong-'

            return authenticateUser(email, password)
                .catch(error => {
                    expect(error).to.be.an.instanceof(CredentialsError)
                    expect(error.message).to.equal(`wrong password`)
                })
        })
    })

    it('should fail when user does not exist', () =>
        authenticateUser(email, password)
            .catch(error => {
                expect(error).to.be.an.instanceof(NonExistenceError)
                expect(error.message).to.equal(`user with e-mail ${email} does not exist`)
            })
    ).timeout(5000)

    it('should fail when inputs with incorrect format are introduced', async () => {

        try {
            authenticateUser( "", password)

        } catch (error) {
            expect(error).to.exist

            expect(error).to.be.an.instanceof(VoidError)
            expect(error.message).to.equal(`string is empty or blank`)
        }

        try {
            authenticateUser( email, "")

        } catch (error) {
            expect(error).to.exist

            expect(error).to.be.an.instanceof(VoidError)
            expect(error.message).to.equal(`string is empty or blank`)
        }

        try {
            authenticateUser( [""], password)

        } catch (error) {
            expect(error).to.exist

            expect(error).to.be.an.instanceof(TypeError)
            expect(error.message).to.equal(` is not a string`)
        }

        try {
            authenticateUser( email, [""])

        } catch (error) {
            expect(error).to.exist

            expect(error).to.be.an.instanceof(TypeError)
            expect(error.message).to.equal(` is not a string`)
        }
    })

    afterEach(() => User.deleteMany())

    after(mongoose.disconnect)
})