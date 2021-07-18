require('dotenv').config()

const { env: { TEST_MONGODB_URL: MONGODB_URL } } = process

const registerUser = require('./register-user')
const { random } = Math
const { expect } = require('chai')
require('../commons/polyfills/json')
const { mongoose, configs: {userStatuses}, models: { User } } = require('../data')
const bcrypt = require('bcryptjs')

const { errors: { DuplicityError, VoidError } } = require('../commons')

describe('server logic - register user', () => {
    before(() => mongoose.connect(MONGODB_URL))

    let email, password

    beforeEach(async () => {
        await User.deleteMany()

        email = `e-${random()}@mail.com`
        password = `password-${random()}`
    })

    const statusesList = Object.values(userStatuses)

    for (const i in statusesList){
        it('should succeed on valid data for all potential user statuses', async () => {

            const result = await registerUser(email, password, statusesList[i])
    
            expect(result).to.be.undefined
    
            const users = await User.find()
    
            expect(users.length).to.equal(1)
    
            const [user] = users
    
            expect(user.email).to.equal(email)
            expect(user.status).to.equal(statusesList[i])
    
            const match = await bcrypt.compare(password, user.password)
    
            expect(match).to.be.true
        }).timeout(5000)
    }
        
    describe('when user already exists', () => {
        beforeEach(() => User.create({ email, password, status: userStatuses['user'] }))

        it('should fail on trying to register an existing user', async () => {
            try {
                await registerUser(email, password, userStatuses['user'])
            } catch (error) {
                console.log(error)
                expect(error).to.exist

                expect(error).to.be.an.instanceof(DuplicityError)
                expect(error.message).to.equal('Invalid Email')
            }
        })
    })

    it('should fail when inputs with incorrect format are introduced', async () => {
        try {
            registerUser(email, password, "")

        } catch (error) {
            expect(error).to.exist

            expect(error).to.be.an.instanceof(VoidError)
            expect(error.message).to.equal(`string is empty or blank`)
        }

        try {
            registerUser("", password, userStatuses['user'])

        } catch (error) {
            expect(error).to.exist

            expect(error).to.be.an.instanceof(VoidError)
            expect(error.message).to.equal(`string is empty or blank`)
        }

        try {
            registerUser(email, "", userStatuses['user'])

        } catch (error) {
            expect(error).to.exist

            expect(error).to.be.an.instanceof(VoidError)
            expect(error.message).to.equal(`string is empty or blank`)
        }

        try {
            registerUser(email, password, [])

        } catch (error) {
            expect(error).to.exist

            expect(error).to.be.an.instanceof(TypeError)
            expect(error.message).to.equal(` is not a string`)
        }

        try {
            registerUser([""], password, userStatuses['user'])

        } catch (error) {
            expect(error).to.exist

            expect(error).to.be.an.instanceof(TypeError)
            expect(error.message).to.equal(` is not a string`)
        }

        try {
            registerUser(email, password, [""])

        } catch (error) {
            expect(error).to.exist

            expect(error).to.be.an.instanceof(TypeError)
            expect(error.message).to.equal(` is not a string`)
        }

        try {
            registerUser(email, password, "something")

        } catch (error) {
            expect(error).to.exist

            expect(error).to.be.an.instanceof(TypeError)
            expect(error.message).to.equal(`input something is not part of the allowed list`)
        }
    })

    afterEach(() => User.deleteMany())

    after(mongoose.disconnect)
})