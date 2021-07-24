const { permissions } = require('../configs');
const {
	errors: { CredentialsError },
} = require('../../commons');
const { handleError } = require('../helpers');
const { retrieveUserById } = require('../../logic');

module.exports = (action) => (req, res, next) => {
	try {
		const {
			payload: { sub },
		} = req;

		retrieveUserById(sub)
			.then(({ status }) => {
				const isPermitted = permissions[status][action];
				if (!isPermitted)
					throw new CredentialsError(
						'The requester is not authorised'
					);
				next();
			})
			.catch((error) => handleError(error, res));
	} catch (error) {
		handleError(error, res);
	}
};
