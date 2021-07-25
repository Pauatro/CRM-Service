require('../commons/polyfills/string');
require('../commons/polyfills/json');
const fsPromises = require('fs').promises;
const {
	errors: { NonExistenceError },
} = require('../commons');
const {
	models: { User, Customer },
    queries: { deleteFile, uploadFile },
    configs: { s3ObjectTags: { publicAccessTag }}
} = require('../data');
const uuidv4 = require('uuid').v4

module.exports = (id, userId, buffer) => {
	String.validate.notVoid(id);
	String.validate.notVoid(userId);
    if(!(buffer instanceof Buffer)) throw new TypeError('buffer should be an instance of Buffer')

	return (async () => {

		const user = await User.findById(userId);

		if (!user)
			throw new NonExistenceError(`the requester does not exist`);

        const customer = await Customer.findById(id);

        if (!customer)
            throw new NonExistenceError(`the requested customer does not exist`);
        
        const fileName = `${uuidv4()}`
        const path = `uploads/${fileName}`

        await fsPromises.writeFile(path, buffer)

        const { Location: photo } = await uploadFile(path, fileName, publicAccessTag)

        await fsPromises.unlink(path)

        const previousPhoto = customer.photo

        if(!!previousPhoto) {
            const splitUrl = previousPhoto.split('/')
            await deleteFile(splitUrl[splitUrl.length-1])
        }

        await Customer.updateOne({_id: id}, { photo, lastModifiedBy: userId })

        return photo
	})();
};
