require('dotenv').config();

const {
	env: { TEST_MONGODB_URL: MONGODB_URL },
} = process;
const retrieveUserById = require('./retrieve-user-by-id');
const { random } = Math;
const { expect } = require('chai');
const {
	mongoose,
	models: { User },
	configs: { userStatuses },
} = require('../data');
const bcrypt = require('bcryptjs');
const { NonExistenceError } = require('../commons/errors');

describe('server logic - retrieve user by id', () => {
	before(() => mongoose.connect(MONGODB_URL));

	let email, password, status, hash, userId;

	beforeEach(() =>
		User.deleteMany()
			.then(() => {
				email = `e-${random()}@mail.com`;
				password = `password-${random()}`;
				status = userStatuses.user;

				return bcrypt.hash(password, 10);
			})
			.then((_hash) => (hash = _hash))
	);

	describe('when the user exists', () => {
		beforeEach(() =>
			User.create({ email, password: hash, status: userStatuses.user })
				.then((user) => (userId = user.id))
		);

		it('should succeed to return the full user information', () => {
			retrieveUserById(userId)
				.then(user => {
					expect(user.email).to.equal(email);
					expect(user.password).to.equal(hash);
					return;
				})
				.catch((error) => {
                    expect(error).to.not.exist; 
                    return;
                });
		});
	});

	it('should fail when the user does not exist', () =>
		retrieveUserById('5edfd817d242780ac65bc59c')
			.then((user) => {
				expect(user).to.not.exist;
				return;
			})
			.catch((error) => {
				expect(error).to.exist;
				expect(error).to.be.an.instanceof(NonExistenceError);
				expect(error.message).to.equal(
					`the requested user does not exist`
				);
				return;
			}));

	afterEach(() => User.deleteMany());

	after(mongoose.disconnect);
});
