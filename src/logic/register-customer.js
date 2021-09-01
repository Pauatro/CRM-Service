/**
 * Creates a new customer if the introduced is not in use
 *
 * @param {string} name The user e-mail.
 * @param {string} surname The user surname.
 * @param {string} userId Id of the creator.
 *
 * @throws {TypeError} If any of the parameters does not match the corresponding type.
 * @throws {VoidError} If any of the parameters expected to be a string is an empty string.
 */

require('../commons/polyfills/string');
const {
	errors: { NonExistenceError },
} = require('../commons');
const {
	queries: { findUserById, createCustomer },
} = require('../data');

module.exports = (name, surname, userId) => {
	String.validate.notVoid(name);
	String.validate.notVoid(surname);
	String.validate.notVoid(userId);

	return (async () => {
		const user = await findUserById(userId);

		if (!user) throw new NonExistenceError(`User with introduced id does not exist`);

		await createCustomer(name, surname, userId);
		return;
	})();
};
