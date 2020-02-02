var express = require('express');
var router = express.Router();
require('cross-fetch/polyfill');
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
var sess;


var poolData = {
    UserPoolId: 'us-east-2_1PKgjCHvs', // Your user pool id here
    ClientId: '2jnef8dug84shaot8grvdg45lg', // Your client id here
};
var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);


router.get('/', function (req, res, next) {
    res.render('index', {title: 'Signup'});
});
router.post('/', function (req, res, next) {
    var attributeList = [];

    var dataEmail = {
        Name: 'email',
        Value: req.body.email,
    };

    var dataPhoneNumber = {
        Name: 'phone_number',
        Value: req.body.phone_number,
    };
    var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
    var attributePhoneNumber = new AmazonCognitoIdentity.CognitoUserAttribute(
        dataPhoneNumber
    );

    attributeList.push(attributeEmail);
    attributeList.push(attributePhoneNumber);

    userPool.signUp(req.body.username, req.body.password, attributeList, null, function (err, result) {
        if (err) {
            console.log(err.message || JSON.stringify(err));
            return;
        }
        var cognitoUser = result.user;
        console.log('user name is ' + cognitoUser.getUsername());
        res.redirect('/signin');
    });
});

router.get('/signin', function (req, res, next) {
    res.render('signin', {title: 'Signin'});
});
router.post('/signin', function (req, res, next) {
    sess = req.session;

    var authenticationData = {
        // Username: req.body.username,
        // Password: req.body.password,
        Username: 'vaggelisdel',
        Password: 'Del12345!@#$%',
    };
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
        authenticationData
    );

    var userData = {
        // Username: req.body.username,
        Username: 'vaggelisdel',
        Pool: userPool,
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            sess.accesstoken = result.getIdToken().getJwtToken();
            // console.log(result.getIdToken().getJwtToken());
            console.log("Connected!!");
            res.redirect('/dashboard');
        },
        onFailure: function (err) {
            console.log(err.message || JSON.stringify(err));
            res.redirect('/signin');
        },
    });
});

module.exports = router;
