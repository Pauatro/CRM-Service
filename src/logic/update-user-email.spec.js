require('dotenv').config()

const { env: { TEST_MONGODB_URL: MONGODB_URL } } = process

const updateUserEmail = require('./update-user-email')
const { random } = Math
const { expect } = require('chai')
const { mongoose, models: { User }, configs: { userStatuses } } = require('../data')
const bcrypt = require('bcryptjs')
const { errors: { NonExistenceError, VoidError, DuplicityError } } = require('../commons')

describe('server logic - update user email', () => {
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
                .then(user=>userId = user.id)
        )

        it('should succeed on correct inputs', () =>
            (async ()=>{

                const newEmail = 'heyamail@email.com'
                await updateUserEmail(userId, newEmail)
                    
                const user = await User.findById(userId)

                expect(user).to.exist
                expect(user.email).to.equal(newEmail)
            })()

        )

        it('should fail when the email is already in use', () =>
            updateUserEmail( userId, email)
                .catch(error => {
                    expect(error).to.be.an.instanceof(DuplicityError)
                    expect(error.message).to.equal(`${email} is already in use`)
                })
        )
    })

    it('should fail when user does not exist', () =>
        updateUserEmail( "5edfd817d242780ac65bc59c", 'heymail@email.com')
            .catch(error => {
                expect(error).to.be.an.instanceof(NonExistenceError)
                expect(error.message).to.equal(`the requested user does not exist`)
            })
    )

    it('should fail when inputs with incorrect format are introduced', async () => {

        try {
            updateUserEmail("", 'email@email.com')

        } catch (error) {
            expect(error).to.exist

            expect(error).to.be.an.instanceof(VoidError)
            expect(error.message).to.equal(`string is empty or blank`)
        }

        try {
            updateUserEmail("5edfd817d242780ac65bc59c", "")

        } catch (error) {
            expect(error).to.exist

            expect(error).to.be.an.instanceof(VoidError)
            expect(error.message).to.equal(`string is empty or blank`)
        }

        try {
            updateUserEmail("5edfd817d242780ac65bc59c", '@')

        } catch (error) {
            expect(error).to.exist

            expect(error).to.be.an.instanceof(Error)
            expect(error.message).to.equal(`@ is not an e-mail`)
        }
    })

    afterEach(() => User.deleteMany())

    after(mongoose.disconnect)
})