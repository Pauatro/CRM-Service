require('dotenv').config()
const S3 = require('aws-sdk/clients/s3')
const{
    env: {
        S3_BUCKET_REGION: region,
        S3_ACCESS_KEY: accessKeyId,
        S3_SECRET_KEY: secretAccessKey,
    }
} = process

module.exports = new S3({
    region,
    accessKeyId,
    secretAccessKey,
})