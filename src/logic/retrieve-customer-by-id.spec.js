require('dotenv').config();

const {
	env: { TEST_MONGODB_URL: MONGODB_URL },
} = process;
const retrieveCustomerById = require('./retrieve-customer-by-id');
const { random } = Math;
const { expect } = require('chai');
const {
	mongoose,
	models: { User, Customer },
	configs: { userStatuses },
} = require('../data');
const bcrypt = require('bcryptjs');
const { NonExistenceError } = require('../commons/errors');

describe('server logic - retrieve customer by id', () => {
	before(() => mongoose.connect(MONGODB_URL));

	let email, password, status, hash, userId, name, surname, customerId, lastModifiedBy, photo;

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

				return bcrypt.hash(password, 10);
			})
			.then((_hash) => (hash = _hash))
			.then(Customer.deleteMany())
	);

	describe('when the customer exists', () => {
		beforeEach(() =>
			User.create({ email, password: hash, status: userStatuses.user })
				.then((user) => (userId = user.id))
				.then(() =>
					Customer.create({ name, surname, createdBy: userId })
				)
                .then(
                    (customer) => (customerId = customer.id)
                )
                .then(()=>Customer.updateOne({_id: customerId}, {lastModifiedBy, photo}))

		);

		it('should succeed to return the full user information', () => {
			retrieveCustomerById(customerId)
				.then(customer => {
					expect(customer.name).to.equal(name);
					expect(customer.surname).to.equal(surname);
					expect(customer.createdBy).to.equal(userId);
					expect(customer.lastModifiedBy).to.equal(lastModifiedBy);
					expect(customer.photo).to.equal(photo);
					return;
				})
				.catch((error) => {
                    expect(error).to.not.exist; 
                    return;
                });
		});
	});

	it('should fail when the customer does not exist', () =>
		retrieveCustomerById('5edfd817d242780ac65bc59c')
			.then((customer) => {
				expect(customer).to.not.exist;
				return;
			})
			.catch((error) => {
				expect(error).to.exist;
				expect(error).to.be.an.instanceof(NonExistenceError);
				expect(error.message).to.equal(
					`the requested customer does not exist`
				);
				return;
			}));

	afterEach(() => User.deleteMany().then(() => Customer.deleteMany()));

	after(mongoose.disconnect);
});
