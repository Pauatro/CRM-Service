/**
 * Updates user with introduced email if it exists
 *
 * @param {string} id The user id.
 * @param {string} email The user's new email.
 *
 * @throws {TypeError} If any of the parameters does not match the corresponding type.
 * @throws {VoidError} If any of the parameters expected to be a string is an empty string.
 * @throws {NonExistenceError} If the user does not exist in the database.
 * @throws {Error} If e-mail does not match the expected format.
 */

require('../commons/polyfills/string');
require('../commons/polyfills/json');
const {
	errors: { NonExistenceError, DuplicityError },
	utils: { Email },
} = require('../commons');
const {
	models: { User },
} = require('../data');

module.exports = (id, email) => {
	String.validate.notVoid(id);
	String.validate.notVoid(email);
	Email.validate(email);

	return (async () => {
		const user = await User.findById(id);

		if (!user)
			throw new NonExistenceError(`the requested user does not exist`);

		const emailUser = await User.findOne({ email });

		if (!!emailUser) throw new DuplicityError(`${email} is already in use`);

		await User.updateOne({ _id: id }, { email });
	})();
};
