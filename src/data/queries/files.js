const { env: { S3_BUCKET_NAME } } = process
const s3 = require('../s3')
const fs = require('fs')

const uploadFile  =  (path, filename, tags) => {
    String.validate.notVoid(path)
    String.validate.notVoid(filename)

	const fileStream = fs.createReadStream(path);

	const uploadParams = {
		Bucket: S3_BUCKET_NAME,
		Body: fileStream,
		Key: filename,
		Tagging: tags
	};

	return s3.upload(uploadParams).promise();
};

const deleteFile = (filename)=>{
    String.validate.notVoid(filename)

    const uploadParams = {
        Bucket: S3_BUCKET_NAME,
        Key: filename
    }

    return s3.deleteObject(uploadParams).promise()
}

module.exports = {
    deleteFile,
    uploadFile
}