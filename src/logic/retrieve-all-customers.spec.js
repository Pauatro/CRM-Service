require('dotenv').config();

const {
	env: { TEST_MONGODB_URL: MONGODB_URL },
} = process;
const retrieveAllCustomers = require('./retrieve-all-customers');
const { random } = Math;
const { expect } = require('chai');
const {
	mongoose,
	models: { User, Customer },
	configs: { userStatuses },
} = require('../data');
const bcrypt = require('bcryptjs');

describe('server logic - retrieve all customers', () => {
	before(() => mongoose.connect(MONGODB_URL));

	let email, password, status, hash, userId, name, surname;

	beforeEach(() =>
		User.deleteMany()
			.then(() => {
				email = `e-${random()}@mail.com`;
				password = `password-${random()}`;
				status = userStatuses.user;
				name = `name-${random()}`;
				surname = `surname-${random()}`;

				return bcrypt.hash(password, 10);
			})
			.then((_hash) => (hash = _hash))
			.then(Customer.deleteMany())
	);

	describe('when customers exist', () => {
		beforeEach(() =>
			User.create({ email, password: hash, status: userStatuses.user })
				.then((user) => (userId = user.id))
				.then(() => {
					Customer.create({ name, surname, createdBy: userId });
				})
		);

		it('should succeed to return a list of emails and statuses', () => {
			retrieveAllCustomers().then((customers) =>
				customers.forEach(
					({ name: _name, surname: _surname, createdBy }) => {
						expect(_name).to.equal(name);
						expect(_surname).to.equal(surname);
						expect(createdBy).to.equal(userId);
					}
				)
			);
		});
	});

	it('should fail when customers do not exist', () =>
		retrieveAllCustomers().then((customers) => {
			expect(customers.length).to.equal(0);
		}));

	afterEach(() => User.deleteMany().then(() => Customer.deleteMany()));

	after(mongoose.disconnect);
});
