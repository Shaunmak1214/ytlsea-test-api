# Payment transferring module with biometrics authentication

## Quick Start

#### Clone the repo

`git clone https://github.com/Shaunmak1214/ytlsea-test-api.git`

#### Install necessary dependencies

`yarn install`

#### Check environment variables

- Setup your own mongodb instance on local or remotely via mongodb atlas or other providers
- Make sure the `CHECKSUM_KEY` matches the one you have on the [app](https://github.com/Shaunmak1214/ytlsea-test-app.git)
- `PAY_NET_FAILURE_RATE` this is probability of paynet error, you can set it to 0 to disable paynet errors all together.

`vim .env`

_note: To generate a checksum key, you can use websites like these_ -> https://randomkeygen.com/

#### Start server

`yarn dev`

#### Setup Users and postman scripts

I've setup a [postman collection](https://www.postman.com/rodeosuperapp/workspace/ytlseaapp-demo-api/) with all the endpoints and scripts to test the api.

1. Go to the `Create Users` tab, and create a user. eg:

```json
{
  "email": "shaonmak123qwe@gmail.com",
  "password": "Y123456789",
  "phoneNumber": "+60189495842",
  "name": "Mak Yen Wei"
}
```

2. Go to the `Login` tab, and login with your credentials. eg:

```json
{
  "phoneNumber": "+60189495832",
  "password": "Y123456789"
}
```

_note: The access token is automatically added into postman's environments, so you don't have to populate this everytime you make a authenticated request._

2. Go to the `Account` tab, and create your account.

```json
{
  "accountName": "Mak Yen Wei",
  "accountNumber": "524678096781",
  "accountType": "current",
  "currency": "MYR",
  "provider": "mastercard",
  "authorizedAmount": "100",
  "preferred": true
}
```

3. Go to the `Transfer` tab, and reload some money to your own account. eg:

```json
{
  "account": "524678096781", // take note that this is the accountNumber not account.id
  "description": "123",
  "amount": 100.0,
  "transactionType": "reload",
  "to": "+60189495129"
}
```

#### To simulate paynet errors

- Refer to the above env variables
- Set `PAY_NET_FAILURE_RATE` to a value between 0 and 100
- The paynet error codes are configured here `src/config/error_codes.ts` and extracted from [paynet's website](https://docs.developer.paynet.my/docs/fpx/response-code#fpx-services-response-code)

#### Feature Highlights

1. Checksums to secure transfer
2. Paynet error codes simulator
