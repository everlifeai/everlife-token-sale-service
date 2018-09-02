# EverLife.AI Token Sale Service

This is the EverLife.AI Token Sale Backend Service Module. The server side logic for Token Sale resides here.

## Deployment Setup

### Requirements

1. Nodejs version >= 8.11.1
2. npm - latest
3. MongoDB 4.0.

### Environment Variables

Configuration of the service it done through setting the following environment variables before starting the service.

|Variable               |Example Value|Description|
|-----------------------|-------------|-----------|
|ASSET_CODE             |EVER||
|ISSUING_PUBLIC         |GBGXEJ73RRP5UBRABKYXCECF25YLO35GEFXJUJHPUWOICSK7ODLWEDC4||
|ISSUING_SECRET         |SCUUPG52W3VEGFGRR3DEOFX5PYPPGOIKINGCPI2PFY4T6BQLTW3GOKF6||
|DIST_PUBLIC            |GCWPG42F3UNVYU37XQTNKH57D2RGEIZ6O3D6AI5UCGXQ2RT2XHOW6HNM||
|DIST_SECRET            |SA5P5LGCOMX2DK7CFSDEFGAL4VFDLAKVXK4NI7N72COGU27FJGNS4MOU||
|TOKEN_SECRET           |yqJhMPorrBRUhcY4XhX6f8eDBUembEBv||
|NODE_ENV               |production||
|DB_CONNECTION_STRING   |mongodb://localhost||
|STELLAR_ENV            |development||
|CAPTCHA_SECRET         |6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe|Must match the key (CAPTCH_SITE_KEY) used in the frontend. (Generic dev key is shown as example.)|
|AWS_BUCKET_NAME        |everlife-dev||
|AWS_REGION             |US_EAST_1||
|AWS_ACCESSKEY_ID       |||
|AWS_SECRET_ACCESSKEY   |||
|IDM_PUB_KEY_FILE       |../config/idmPublicKey.txt|


### Installing and running the service

``` bash
# install dependencies
npm install --prod

# serve with hot reload at localhost:8080
npm start
```

