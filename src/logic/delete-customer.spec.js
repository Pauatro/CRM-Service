require('dotenv').config();

const {
	env: { TEST_MONGODB_URL: MONGODB_URL },
} = process;

const deleteCustomer = require('./delete-customer');
const { random } = Math;
const { expect } = require('chai');
require('../commons/polyfills/json');
const {
	mongoose,
	models: { Customer, User },
	configs: { userStatuses },
} = require('../data');
const bcrypt = require('bcryptjs');
const {
	errors: { NonExistenceError, VoidError },
} = require('../commons');

describe('server logic - delete customer', () => {
	before(() => mongoose.connect(MONGODB_URL));

	let name, surname, customerId, email, password, hash, userId;

	beforeEach(() =>
		Customer.deleteMany()
			.then(User.deleteMany())
			.then(() => {
				name = `name-${random()}`;
				surname = `surname-${random()}`;
				email = `e-${random()}@mail.com`;
				password = `password-${random()}`;

				return bcrypt.hash(password, 10);
			})
			.then((_hash) => (hash = _hash))
	);

	describe('when customer already exists', () => {
		beforeEach(async () => {
			await User.create({
				email,
				password: hash,
				status: userStatuses.user,
			}).then((user) => (userId = user.id));

			await Customer.create({ name, surname, createdBy: userId }).then(
				(customer) => (customerId = customer.id)
			);
		});

		it('should succeed on correct inputs', () =>
			(async () => {
				await deleteCustomer(customerId);

				const customer = await Customer.findById(customerId);
				expect(customer).to.not.exist;
			})());
	});

	it('should fail when customer does not exist', () =>
		deleteCustomer('5edfd817d242780ac65bc59c').catch((error) => {
			expect(error).to.be.an.instanceof(NonExistenceError);
			expect(error.message).to.equal(`the requested customer does not exist`);
		}));

	it('should fail when inputs with incorrect format are introduced', async () => {
		try {
			deleteCustomer('');
		} catch (error) {
			expect(error).to.exist;

			expect(error).to.be.an.instanceof(VoidError);
			expect(error.message).to.equal(`string is empty or blank`);
		}

		try {
			deleteCustomer(['']);
		} catch (error) {
			expect(error).to.exist;

			expect(error).to.be.an.instanceof(TypeError);
			expect(error.message).to.equal(` is not a string`);
		}
	});

	afterEach(() => Customer.deleteMany().then(User.deleteMany()));

	after(mongoose.disconnect);
});
