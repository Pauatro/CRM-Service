/**
 * Returns customer with introduced id if it exists
 *
 * @param {string} id Id of the customer to be retrieved.
 *
 * @throws {TypeError} If any of the parameters does not match the corresponding type.
 * @throws {VoidError} If any of the parameters expected to be a string is an empty string.
 * @throws {NonExistenceError} If the customer does not exist in the database.
 */

require('../commons/polyfills/string');
const {
	errors: { NonExistenceError },
} = require('../commons');
const {
	models: { Customer },
	utils: { cleanSample }
} = require('../data');

module.exports = (id) => {
	String.validate.notVoid(id);

	return (async () => {
		const customer = await Customer.findById(id).lean();

		if (!customer)
			throw new NonExistenceError(`the requested customer does not exist`);

        return cleanSample(customer)
	})();
};
