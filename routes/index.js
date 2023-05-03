const express = require('express');
const router = express.Router();
let storage = {};

const userController = require("../controllers/userController");

const authenticationService = require("../services/authentication");
const userModel = require("../models/userModel");

router.get('/', (req, res) => {
    res.render('index', { title: 'Express' });
});

router.get('/chat', (req, res) => {
    res.render('chat')
});

router.route('/login')
    .get((req, res, next) => {
        res.render('login');
    })
    .post((req, res, next) => {
        userModel.getUsers()
            .then((users) => {
                authenticationService.authenticateUser(req.body, users, res)
            })
            .catch((err) => {
                res.sendStatus(500)
            })
    });

router.get('/logout', (req, res, next) => {
    res.clearCookie('accessToken');
    res.redirect('/');
});

router.get('/register', userController.registerUser);
router.post('/register', userController.registeredUser);



// IRRELEVANT

/* router.get('/', (req, res) => {
    console.log('sending back storage var with content');
    console.log(storage);
    res.json(storage);
}); */

// more than one callback function
router.get('/example/b', function (req, res, next) {
    console.log('The response will be sent by the next function ...');
    next();
}, function (req, res) {
    res.send('Hello from B!');
});

// an array of callback functions
const cbC1 = function (req, res, next) {
    console.log('cbC1');
    next();
}
const cbC2 = function (req, res, next) {
    console.log('cbC2');
    next();
}
const cbC3 = function (req, res) {
    res.send('Hello World! I am cbC3!');
}
router.get('/example/c', [cbC1, cbC2, cbC3])

const cbD1 = function (req, res, next){
    console.log('cbD1');
    next();
}

const cbD2 = function (req, res, next){
    console.log('cbD2');
    next();
}

router.get('/example/d', [cbD1, cbD2], function (req, res, next){
    console.log('This response will be sent by the next function ...');
    next();
}, function cbD3(req, res){
    res.send('Hello World! This is D! (cbD3)');
});

// POST to '/' = index route
router.post('/', (req, res) => {
    console.log(req.body);
    storage = req.body;
    res.send('received a POST request');
});

router.get('/cookies', (req, res, next) => {
    let counter = req.cookies['visitCounter'];
    console.log("Current counter value: " + counter);
    if (isNaN(counter)) counter = 0;
    counter ++;
    console.log("New counter value: " + counter);
// Set cookie
    res.cookie('visitCounter', counter);
    res.send('Cookie was set to ' + counter);
    res.cookie("visitCounter", counter, {maxAge: 2*60*60*1000});
});

module.exports = router;
