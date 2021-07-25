require('dotenv').config();

const {
	env: { TEST_MONGODB_URL: MONGODB_URL },
} = process;

const updateCustomerImage = require('./update-customer-photo');
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
const fsPromises = require('fs').promises;

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
		fileContent;

	const testFilePath = 'test-images/test-image.jpeg';

	beforeEach(() =>
		User.deleteMany()
			.then(() => {
				email = `e-${random()}@mail.com`;
				password = `password-${random()}`;
				status = userStatuses.user;
				name = `name-${random()}`;
				surname = `surname-${random()}`;
				photo = `url-${random()}`;

				return bcrypt.hash(password, 10);
			})
			.then((_hash) => (hash = _hash))
			.then(Customer.deleteMany())
			.then(() => fsPromises.mkdir('uploads-test'))
			.then(() => fsPromises.readFile(testFilePath))
			.then((content) => (fileContent = new Buffer.from(content)))
	);

	describe('when user already exists', () => {
		beforeEach(() =>
			User.create({ email, password: hash, status }).then(
				(user) => (userId = user.id)
			)
		);

		describe('when the customer exists', () => {
			beforeEach(async () => {
				await Customer.create({
					name,
					surname,
					createdBy: userId,
				}).then((customer) => (customerId = customer.id));
			});

			it('should succeed to update the photo on correct inputs and save userId as lastModifiedBy', () =>
				(async () => {
					await updateCustomerImage(customerId, userId, fileContent);

					const customer = await Customer.findById(customerId);
					expect(customer).to.exist;
					expect(customer.photo).to.exist;
					expect(customer.lastModifiedBy).to.equal(userId);
				})());
		});

		it('should fail when the customer does not exist', () =>
			updateCustomerImage(
				'5edfd817d242780ac65bc59c',
				userId,
				fileContent
			).catch((error) => {
				expect(error).to.be.an.instanceof(NonExistenceError);
				expect(error.message).to.equal(
					`the requested customer does not exist`
				);
			}));
	});

	it('should fail when user does not exist', () =>
		updateCustomerImage(
			'5edfd817d242780ac65bc59c',
			'5edfd817d242780ac65bc59c',
			fileContent
		).catch((error) => {
			expect(error).to.be.an.instanceof(NonExistenceError);
			expect(error.message).to.equal(`the requester does not exist`);
		}));

	it('should fail when inputs with incorrect format are introduced', async () => {
		try {
			updateCustomerImage('', '5edfd817d242780ac65bc59c', fileContent);
		} catch (error) {
			expect(error).to.exist;

			expect(error).to.be.an.instanceof(VoidError);
			expect(error.message).to.equal(`string is empty or blank`);
		}

		try {
			updateCustomerImage('5edfd817d242780ac65bc59c', '', fileContent);
		} catch (error) {
			expect(error).to.exist;

			expect(error).to.be.an.instanceof(VoidError);
			expect(error.message).to.equal(`string is empty or blank`);
		}

		try {
			updateCustomerImage(
				'5edfd817d242780ac65bc59c',
				'5edfd817d242780ac65bc59c',
				[]
			);
		} catch (error) {
			expect(error).to.exist;

			expect(error).to.be.an.instanceof(TypeError);
			expect(error.message).to.equal(
				'buffer should be an instance of Buffer'
			);
		}
	});

	afterEach(() =>
		User.deleteMany()
			.then(() => Customer.deleteMany())
			.then(() => fsPromises.rmdir('uploads-test'))
	);

	after(mongoose.disconnect);
});
