Hi there! This is the CRM-Service API.

**Getting Started**

Follow the next steps to get the database up and running:

1. Download dependencies

``` npm install```

2. Generate a MongoDB Cluster and an S3 Bucket.

MongoDB:
https://docs.atlas.mongodb.com/tutorial/create-new-cluster/

S3:
https://docs.aws.amazon.com/AmazonS3/latest/userguide/create-bucket-overview.html

To access images directly via the URL, both the bucket and the account need to have the public access blockage turned off. The bucked should include the following policy: 

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::crm-service-images-test/*",
            "Condition": {
                "StringEquals": {
                    "s3:ExistingObjectTag/public": "yes"
                }
            }
        }
    ]
}
```

This way, only images uploaded with the tag "public=yes" will be publically available.

3. Generate .env file in the main folder wih the following variables:

PORT_CLI: the local port where you want to start the API.

SECRET: a string for the jwt token encryption.

MONGODB_URL: a string with the mongoDB database uri you want to use for the API.

TEST_MONGODB_URL: a string with the mongoDB database uri you want to use for tests (the tests will delete all the information from the database in each cycle).

S3_BUCKET_NAME: a string for the bucket name of your s3 instance.

S3_BUCKET_REGION: a string for the bucket region of your s3 instance.

S3_ACCESS_KEY: access key for the authorised user of your s3 instance.

S3_SECRET_KEY: secret key for the authorised user of your s3 instance.

4. Start the API

``` node . ```

Note: The endpoint to create and update users needs admin permissions, so you can remove them by either removing the 'rolePermissionsChecker' middleware or by changing the permissions config (api/configs/permissions.js). With that, you'll be able to generate an initial user with admin status (create user + update user status) and start working from there.


**Testing the API**

All unit tests will be run using the following command:

``` npm test ```