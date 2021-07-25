const { env: { S3_BUCKET_NAME } } = process
const s3 = require('../s3')

module.exports = (filename)=>{
    String.validate.notVoid(filename)

    const uploadParams = {
        Bucket: S3_BUCKET_NAME,
        Key: filename
    }

    return s3.deleteObject(uploadParams).promise()
}