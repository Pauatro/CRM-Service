require('dotenv').config()

const { env: { TEST_MONGODB_URL: MONGODB_URL } } = process

const deleteUser = require('./delete-user')
const { random } = Math
const { expect } = require('chai')
require('../commons/polyfills/json')
const { mongoose, models: { User }, configs: {userStatuses} } = require('../data')
const bcrypt = require('bcryptjs')
const { errors: { NonExistenceError, VoidError } } = require('../commons')

describe('server logic - delete user', () => {
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

    describe('when admin already exists', () => {
        beforeEach(() =>
            User.create({ email, password: hash, status: userStatuses.user })
                .then(user => usedId = user.id)
        )

        it('should succeed on correct inputs', () =>
            (async ()=>{
                await deleteUser(email)
                    
                const user = await User.findOne({email})
                expect(user).to.not.exist
            })()

        )
    })

    it('should fail when user does not exist', () =>
        deleteUser( 'wrong' + email)
            .catch(error => {
                expect(error).to.be.an.instanceof(NonExistenceError)
                expect(error.message).to.equal(`user with email ${email} does not exist`)
            })
    )

    it('should fail when inputs with incorrect format are introduced', async () => {
        try {
            deleteUser("")

        } catch (error) {
            expect(error).to.exist

            expect(error).to.be.an.instanceof(VoidError)
            expect(error.message).to.equal(`string is empty or blank`)
        }

        try {
            deleteUser([""])

        } catch (error) {
            expect(error).to.exist

            expect(error).to.be.an.instanceof(TypeError)
            expect(error.message).to.equal(` is not a string`)
        }
    })

    afterEach(() => User.deleteMany())

    after(mongoose.disconnect)
})