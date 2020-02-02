var express = require('express');
var router = express.Router();
require('cross-fetch/polyfill');
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
const request = require('request');
var sess;

CognitoExpress = require("cognito-express");
const app = express();
app.use("/", router);
const cognitoExpress = new CognitoExpress({
    region: "us-east-2",
    cognitoUserPoolId: "us-east-2_1PKgjCHvs",
    tokenUse: "access", //Possible Values: access | id
    tokenExpiration: 3600000 //Up to default expiration of 1 hour (3600000 ms)
});

router.use(function (req, res, next) {
    sess = req.session;
    //I'm passing in the access token in header under key accessToken
    let accessTokenFromClient = req.headers.accesstoken || sess.accesstoken;
    //Fail if token not present in header.

    // if (!accessTokenFromClient) return res.status(401).send("Access Token missing from header");
    if (!accessTokenFromClient) return res.redirect('/signin');

    cognitoExpress.validate(accessTokenFromClient, function (err, response) {

        //If API is not authenticated, Return 401 with error message.
        if (err) return res.status(401).send(err);

        console.log(response);
        //Else API has been authenticated. Proceed.
        res.locals.user = response;
        next();
    });
});

router.get('/', function (req, res, next) {
    // const options = {
    //     url: 'https://0nerp7erwl.execute-api.us-east-2.amazonaws.com/dev',
    //     method: 'GET',
    //     headers: {
    //         'Authorization': req.headers.accesstoken || sess.accesstoken
    //     }
    // };
    //
    // request(options, function(err, response, body) {
    //     let json = JSON.parse(body);
    //     res.send(json);
    // });
    res.send(`Hi ${res.locals.user.username}, your API call is authenticated!`);
});
module.exports = router;
