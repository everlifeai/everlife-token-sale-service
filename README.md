# EverLife.AI Token Sale Service

This is the EverLife.AI Token Sale Backend Service Module. The server side logic for Token Sale resides here.

## Deployment Setup

### Requirements

1. Nodejs version >= 8.11.1
2. npm - latest
3. MongoDB 4.0.

### Environment Variables

Configuration of the service it done through setting the following environment variables before starting the service. The service supports using a `.env` file in the module directory for providing the configuration.

Example `.env`:
```
# Node
NODE_ENV=development

# Stellar
STELLAR_ENV=development
STELLAR_ASSET_CODE=EVER
#   Issuer - The Stellar account that issues the ASSET. Used for user instructions and to verify that trustlines exists.
STELLAR_ASSET_ISSUER=GDRCJ5OJTTIL4VUQZ52PCZYAUINEH2CUSP5NC2R6D6WQ47JBLG6DF5TE
#   Payment recipient - The EverLife Stellar account used to collect XLM payments for EVER purcahses. Used for user instructions.
STELLAR_PAYMENT_RECIPIENT=???

# Database
DB_CONNECTION_STRING=mongodb://localhost
DB_NAME=admin

# Captcha
#   Secret - Must match the key (CAPTCH_SITE_KEY) used in the frontend. Generic dev key is shown as example
CAPTCHA_SECRET=6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe

# AWS
AWS_BUCKET_NAME=everlife-dev
AWS_ACCESSKEY_ID=???
AWS_REGION=US_EAST_1
AWS_ENDPOINT=s3.amazonaws.com
AWS_SECRET_ACCESSKEY=???

# Identity Mind
IDM_PUB_KEY_FILE=../config/idmPublicKey.txt

# CoinPayments API KEY
COINPAYMENTS_KEY=???
COINPAYMENTS_SECRET=???

# CoinMarketCap API KEY
COINMARKETCAP_APIKEY=???
```

### Installing and running the service

``` bash
# install dependencies
npm install --prod

# serve with hot reload at localhost:8080
npm start
```

