Hi there! This is the CRM-Service API.

**Getting Started**

Run the following lines to start the API locally:

1. Download dependencies

``` npm install```

2. Generate .env file in the main folder wih the following variables:

SECRET: a string for the jwt token encryption
PORT_CLI: the local port where you want to start the API
TEST_MONGODB_URL: a string with the mongoDB database uri you want to use

3. Start the API

``` node . ```


**Testing the API**

All unit tests will be run using the following command:

``` npm test ```