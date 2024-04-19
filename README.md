# global-domain-services

This service is to solve the issue where a single person can have multiple wallet addresses and other payment methods. 

Implemented in Node using IrysSDK to upload info to Arweave, and IrysQuery to get the info through the GraphQL.

You need to create an arweave wallet, use the arweave cookbook for that https://cookbook.arweave.dev/getting-started/quick-starts/hw-nodejs.html#generate-a-wallet, and add the data in the env vars. 
The owner env var is the address used to sign the trasnaction. You can upload data to check in the graphQL call which is the owner ID.

Once the env vars are loaded, you can run it using npm run dev.

## Endpoints
This services has three endpoints:

### GET: /ping
A simple get endpoint to check the service is alive

### POST: /user 
To upload or update data of user. it requires the field userdomain in the bode to identify the customer.

### POST /search
It returns the data associated to the userdomain, if it doesn't exist, it returns an empty response.
