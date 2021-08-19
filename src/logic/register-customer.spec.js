require('dotenv').config();

const {
	env: { TEST_MONGODB_URL: MONGODB_URL },
} = process;

const registerCustomer = require('./register-customer');
const { random } = Math;
const { expect } = require('chai');
const {
	mongoose,
	configs: { userStatuses },
	models: { User, Customer },
} = require('../data');

const {
	errors: { NonExistenceError, VoidError },
} = require('../commons');

describe('server logic - register customer', () => {
	before(() => mongoose.connect(MONGODB_URL));

	let email, password, name, surname, userId;

	beforeEach(async () => {
		await User.deleteMany();
		await Customer.deleteMany();

		email = `e-${random()}@mail.com`;
		password = `password-${random()}`;
        name = `n-${random()}`;
        surname = `n-${random()}`;
	});

	describe('when user already exists', () => {
		beforeEach(async () => {
			await User.create({ email, password, status: userStatuses.user }).then(
				(user) => (userId = user.id)
			);
		});

		it('should succeed on valid data', async () => {
			const result = await registerCustomer(
				name,
				surname,
				userId
			);

			expect(result).to.be.undefined;

			const customers = await Customer.find();

			expect(customers.length).to.equal(1);

			const [customer] = customers;

			expect(customer.name).to.equal(name);
			expect(customer.surname).to.equal(surname);
		});
	});

    describe('when user does not exist', () => {
        it('should fail to create the customer', async () => {
			const result = await registerCustomer(
				name,
				surname,
				"5edfd817d242780ac65bc59c"
			).catch((error)=>{
                expect(error).to.exist;
                expect(error).to.be.an.instanceof(NonExistenceError);
			    expect(error.message).to.equal(`User with introduced id does not exist`);
            })
		});
    });

	it('should fail when inputs with incorrect format are introduced', async () => {
		try {
			registerCustomer(name, password, '');
		} catch (error) {
			expect(error).to.exist;

			expect(error).to.be.an.instanceof(VoidError);
			expect(error.message).to.equal(`string is empty or blank`);
		}

		try {
			registerCustomer('', surname, "5edfd817d242780ac65bc59c");
		} catch (error) {
			expect(error).to.exist;

			expect(error).to.be.an.instanceof(VoidError);
			expect(error.message).to.equal(`string is empty or blank`);
		}

		try {
			registerCustomer(name, '', "5edfd817d242780ac65bc59c");
		} catch (error) {
			expect(error).to.exist;

			expect(error).to.be.an.instanceof(VoidError);
			expect(error.message).to.equal(`string is empty or blank`);
		}

		try {
			registerCustomer(name, surname, []);
		} catch (error) {
			expect(error).to.exist;

			expect(error).to.be.an.instanceof(TypeError);
			expect(error.message).to.equal(` is not a string`);
		}

		try {
			registerCustomer([''], surname, "5edfd817d242780ac65bc59c");
		} catch (error) {
			expect(error).to.exist;

			expect(error).to.be.an.instanceof(TypeError);
			expect(error.message).to.equal(` is not a string`);
		}

		try {
			registerCustomer(name, surname, ['']);
		} catch (error) {
			expect(error).to.exist;

			expect(error).to.be.an.instanceof(TypeError);
			expect(error.message).to.equal(` is not a string`);
		}
	});

	afterEach(() => User.deleteMany().then(() => Customer.deleteMany()));

	after(mongoose.disconnect);
});
