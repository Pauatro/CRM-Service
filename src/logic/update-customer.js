/**
 * Updates customer with introduced email if it exists
 *
 * @param {string} id The customer id.
 * @param {string} userId The id of the user who is updating.
 * @param {string} customerUpdateData An object containing the new customer information
 *
 * @throws {TypeError} If any of the parameters does not match the corresponding type.
 * @throws {VoidError} If any of the parameters expected to be a string is an empty string.
 * @throws {NonExistenceError} If the user does not exist in the database.
 * @throws {DuplicityError} If a user with the introduced email already exists in the database
 * @throws {Error} If e-mail does not match the expected format.
 */

require('../commons/polyfills/string');
const {
	errors: { NonExistenceError },
} = require('../commons');
const {
	models: { User, Customer },
} = require('../data');

const stringValidation = String.validate.notVoid;

const updateableFieldsAndChecks = {
	photo: stringValidation,
	name: stringValidation,
	surname: stringValidation,
};

module.exports = (id, userId, customerUpdateData) => {
	String.validate.notVoid(id);
	String.validate.notVoid(userId);

	let updates = { lastModifiedBy: userId };

	Object.keys(customerUpdateData).forEach((key) => {
		const check = updateableFieldsAndChecks[key];

		if (!check) throw new TypeError(`${key} is an invalid field`);

		check(customerUpdateData[key]);
		updates[key] = customerUpdateData[key];
	});

	return (async () => {
		const user = await User.findById(userId);

		if (!user) throw new NonExistenceError(`the requester does not exist`);

		const customer = await Customer.findById(id);

		if (!customer)
			throw new NonExistenceError(
				`the requested customer does not exist`
			);

		await Customer.updateOne({ _id: id }, updates);
	})();
};
