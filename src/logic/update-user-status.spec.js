require('dotenv').config()

const { env: { TEST_MONGODB_URL: MONGODB_URL } } = process

const updateUserStatus = require('./update-user-status')
const { random } = Math
const { expect } = require('chai')
require('../commons/polyfills/json')
const { mongoose, models: { User }, configs: {userStatuses} } = require('../data')
const bcrypt = require('bcryptjs')
const { errors: { NonExistenceError, VoidError } } = require('../commons')

describe('server logic - update user status', () => {
    before(() => mongoose.connect(MONGODB_URL))

    let email, password, hash, status

    beforeEach(() =>
        User.deleteMany()
            .then(() => {
                email = `e-${random()}@mail.com`
                password = `password-${random()}`
                status = userStatuses.user

                return bcrypt.hash(password, 10)
            })
            .then(_hash => hash = _hash)
    )

    describe('when user already exists', () => {
        beforeEach(() =>
            User.create({ email, password: hash, status })
        )

        it('should succeed on correct inputs', () =>
            (async ()=>{
                await updateUserStatus(email, userStatuses.admin)
                    
                const user = await User.findOne({email})

                expect(user).to.exist
                expect(user.status).to.equal(userStatuses.admin)
            })()

        )
    })

    it('should fail when user does not exist', () =>
        updateUserStatus( 'wrong' + email, userStatuses.admin)
            .catch(error => {
                expect(error).to.be.an.instanceof(NonExistenceError)
                expect(error.message).to.equal(`user with email ${email} does not exist`)
            })
    )

    it('should fail when inputs with incorrect format are introduced', async () => {
        try {
            updateUserStatus("", userStatuses.admin)

        } catch (error) {
            expect(error).to.exist

            expect(error).to.be.an.instanceof(VoidError)
            expect(error.message).to.equal(`string is empty or blank`)
        }

        try {
            updateUserStatus(email, "")

        } catch (error) {
            expect(error).to.exist

            expect(error).to.be.an.instanceof(VoidError)
            expect(error.message).to.equal(`string is empty or blank`)
        }

        try {
            updateUserStatus(email, "something")

        } catch (error) {
            expect(error).to.exist

            expect(error).to.be.an.instanceof(TypeError)
            expect(error.message).to.equal(`input something is not part of the allowed list`)
        }
    })

    afterEach(() => User.deleteMany())

    after(mongoose.disconnect)
})