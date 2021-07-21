require('dotenv').config();

const {
	env: { TEST_MONGODB_URL: MONGODB_URL },
} = process;

const updateCustomer = require('./update-customer');
const { random } = Math;
const { expect } = require('chai');
require('../commons/polyfills/json');
const {
	mongoose,
	models: { User, Customer },
	configs: { userStatuses },
} = require('../data');
const bcrypt = require('bcryptjs');
const {
	errors: { NonExistenceError, VoidError },
} = require('../commons');

describe('server logic - update customer', () => {
	before(() => mongoose.connect(MONGODB_URL));

	let email,
		password,
		status,
		hash,
		userId,
		name,
		surname,
		customerId,
		lastModifiedBy,
		photo,
		newCustomerData;

	beforeEach(() =>
		User.deleteMany()
			.then(() => {
				email = `e-${random()}@mail.com`;
				password = `password-${random()}`;
				status = userStatuses.user;
				name = `name-${random()}`;
				surname = `surname-${random()}`;
				lastModifiedBy = `by-${random()}`;
				photo = `url-${random()}`;

				newCustomerData = {
					name: `name-${random()}`,
					photo: `url-${random()}`,
					surname: `surname-${random()}`,
				};

				return bcrypt.hash(password, 10);
			})
			.then((_hash) => (hash = _hash))
			.then(Customer.deleteMany())
	);

	describe('when user already exists', () => {
		beforeEach(() =>
			User.create({ email, password: hash, status }).then(
				(user) => (userId = user.id)
			)
		);

		describe('when the customer exists', () => {
			beforeEach(() =>
				Customer.create({ name, surname, createdBy: userId }).then(
					(customer) => (customerId = customer.id)
				)
			);

			it('should succeed to update any fields on correct inputs and saves userId as lastModifiedBy', () =>
				(async () => {
					await updateCustomer(customerId, userId, newCustomerData);

					const customer = await Customer.findById(customerId);

					expect(customer).to.exist;
					expect(customer.name).to.equal(newCustomerData.name);
					expect(customer.surname).to.equal(newCustomerData.surname);
					expect(customer.photo).to.equal(newCustomerData.photo);
					expect(customer.lastModifiedBy).to.equal(userId);
				})());
		});

		it('should fail when the customer does not exist', () =>
			updateCustomer(
				'5edfd817d242780ac65bc59c',
				userId,
				newCustomerData
			).catch((error) => {
				expect(error).to.be.an.instanceof(NonExistenceError);
				expect(error.message).to.equal(
					`the requested customer does not exist`
				);
			}));
	});

	it('should fail when user does not exist', () =>
		updateCustomer(
			'5edfd817d242780ac65bc59c',
			'5edfd817d242780ac65bc59c',
			newCustomerData
		).catch((error) => {
			expect(error).to.be.an.instanceof(NonExistenceError);
			expect(error.message).to.equal(`the requester does not exist`);
		}));

	it('should fail when inputs with incorrect format are introduced', async () => {
		try {
			updateCustomer('', '5edfd817d242780ac65bc59c', newCustomerData);
		} catch (error) {
			expect(error).to.exist;

			expect(error).to.be.an.instanceof(VoidError);
			expect(error.message).to.equal(`string is empty or blank`);
		}

		try {
			updateCustomer('5edfd817d242780ac65bc59c', '', newCustomerData);
		} catch (error) {
			expect(error).to.exist;

			expect(error).to.be.an.instanceof(VoidError);
			expect(error.message).to.equal(`string is empty or blank`);
		}

		try {
			updateCustomer('5edfd817d242780ac65bc59c', '', {
				...newCustomerData,
				photo: '',
			});
		} catch (error) {
			expect(error).to.exist;

			expect(error).to.be.an.instanceof(VoidError);
			expect(error.message).to.equal(`string is empty or blank`);
		}

		try {
			updateCustomer('5edfd817d242780ac65bc59c', '', {
				...newCustomerData,
				name: '',
			});
		} catch (error) {
			expect(error).to.exist;

			expect(error).to.be.an.instanceof(VoidError);
			expect(error.message).to.equal(`string is empty or blank`);
		}

		try {
			updateCustomer('5edfd817d242780ac65bc59c', '', {
				...newCustomerData,
				surname: '',
			});
		} catch (error) {
			expect(error).to.exist;

			expect(error).to.be.an.instanceof(VoidError);
			expect(error.message).to.equal(`string is empty or blank`);
		}
	});

	it('should fail when invalid fields are introduced in the update object', async () => {
		try {
			updateCustomer(
				'5edfd817d242780ac65bc59c',
				'5edfd817d242780ac65bc59c',
				{ ...newCustomerData, test: 'test' }
			);
		} catch (error) {
			expect(error).to.exist;

			expect(error).to.be.an.instanceof(TypeError);
			expect(error.message).to.equal(`test is an invalid field`);
		}
	});

	afterEach(() => User.deleteMany().then(() => Customer.deleteMany()));

	after(mongoose.disconnect);
});
