# Organisation Service
REST APIs for organisation

Frameworks used:
* serverless
* AWS
** API Gateway
** DynamoDb
* jest (for testing)
* standard for linting
* babel for ES6 standards


Reason:
* Easy to code and run with minimal setup
* can run locally
* Easy to deploy and not worry about mangaing instances, load balancing and other server related issues as AWS takes care of it
* serverless has wide variety of package to model database `dynamoose` to document apis and also do request validation

## One time setup for serverless and AWS

### node/npm packages
* install node
* `npm i -g serverless` (serverless package)
* `npm i -g nvm` (nvm for multiple versions of npm)

### Install aws-cli 
To work with AWS from command line
* Install python/python3 and ensure pip/pip3 are in your `PATH` (python3 recommended by AWS-CLI)
* `pip3 install awscli --upgrade --user` or `pip install awscli --upgrade --user` to install 
* https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html 


## Project setup (one time)
On the root folder of the project
* `npm i`
* `sls dynamodb install` (install dynamodb offline)

## To run tests
* `npm run test`

## To run the project locally
This will start *Api Gateway*, *DynamoDb* locally
* `npm start`

## To test from postman
* create organisation
```
curl -X POST \
  http://localhost:3000/organisation/ \
  -H 'Accept: */*' \
  -H 'Accept-Encoding: gzip, deflate' \
  -H 'Cache-Control: no-cache' \
  -H 'Connection: keep-alive' \
  -H 'Content-Length: 118' \
  -H 'Content-Type: application/json' \
  -H 'Host: localhost:3000' \
  -H 'Postman-Token: 0fe87542-10ea-484f-8827-4bacce87185f,f3be7dbe-30d0-4530-becb-d43ef299ce7b' \
  -H 'User-Agent: PostmanRuntime/7.17.1' \
  -H 'cache-control: no-cache' \
  -d '{
	"name": "test",
	"yearFounded" : 2019,
	"revenue": 1099.99,
}'
```
sample response of above request

```
{
    "status": {
        "code": 200,
        "message": null
    },
    "data": {
        "id": "7b8643df-9d08-4761-8c9d-4c0d6762a984",
        "name": "test",
        "yearFounded": 2019,
        "revenue": 1099.99
    },
    "meta": {},
    "errors": []
}
```

* to get organisation
```
curl -X GET \
  http://localhost:3000/organisation/({id) \
  -H 'Accept: */*' \
  -H 'Accept-Encoding: gzip, deflate' \
  -H 'Cache-Control: no-cache' \
  -H 'Connection: keep-alive' \
  -H 'Host: localhost:3000' \
  -H 'Postman-Token: 1bb151d9-adf8-48dd-a71a-cd6ab30daf4a,c501d5e6-5fd3-47d7-9a93-1ccb5df70b35' \
  -H 'User-Agent: PostmanRuntime/7.17.1' \
  -H 'cache-control: no-cache'
```
sample response
```
{
    "status": {
        "code": 200,
        "message": null
    },
    "data": {
        "name": "test",
        "revenue": 1099.99,
        "id": "7b8643df-9d08-4761-8c9d-4c0d6762a984",
        "yearFounded": 2019
    },
    "meta": {},
    "errors": []
}
```

_Known Issues_
* `POST /Organisation` request has request body validation setup. 
when you run locally with any _required_ params missing then it return `500` error instead of `400` but the error message correctly indicates what is missing.
