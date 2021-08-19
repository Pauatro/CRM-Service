require('dotenv').config()

const { env: { TEST_MONGODB_URL: MONGODB_URL } } = process
const retrieveAllUsers = require('./retrieve-all-users')
const { random } = Math
const { expect } = require('chai')
const { mongoose, models: { User }, configs: { userStatuses }  } = require('../data')
const bcrypt = require('bcryptjs')

describe('server logic - retrieve all users', () => {
    before(() => mongoose.connect(MONGODB_URL))

    let email, password, status, hash, userId

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

    describe('when users exist', () => {
        beforeEach(() =>
            User.create({ email, password: hash, status: userStatuses.user })
                .then(user => userId = user.id)
        )

        it('should succeed to return a list of emails and statuses', () =>{
            retrieveAllUsers()
                .then(users => {
                    users.forEach(({ email: _email, status: _status, id})=>{
                        expect(_email).to.equal(email)
                        expect(_status).to.equal(status)
                        expect(id).to.equal(userId)
                    })
                })
        })
    })

    it('should return an empty array when users do not exist', () =>
        retrieveAllUsers()
            .then(users => {
                expect(users.length).to.equal(0)
            })
    )

    afterEach(() => User.deleteMany())

    after(mongoose.disconnect)
})