const userModels = require('../models/userModel.js');
const fs = require("fs");
const path = require("path");

function getUsers(req, res) {
    userModels.getUsers().then((users) => {
        res.render('users', { users });
    });
}

function getUserById(req, res) {
    const id = req.params.id;
    userModels.getUserById(parseInt(id)).then((user) => {
        res.render('user', { user });
    });
}

function editUser(req, res, next) {
    userModels.getUserById(parseInt(req.params.id)).then((user) => {
        if (user.avatarPath === undefined || user.avatarPath === '' || !fs.existsSync('public/avatars/' + user.avatarPath)) {
            user.avatarPath = 'default.png';
        }
        res.render('editUser', {user});
    }).catch((err) => {
        res.sendStatus(500);
    });
}

function updateUser(req, res, next) {
    userModels.updateUser(req.body, req.files)
        .then((user) => {res.render('user', { user })})
        .catch((err) => {res.sendStatus(500); console.log(err);});
}

function addUser(req, res, next) {
    userModels.getUserTableColumns()
        .then(column => res.render('addUser', {column}))
        .catch(error => console.log(error));
}

function createUser(req, res, next) {
    userModels.createUser(req.body, req.files).then((user) => {
        res.render('user', { user });
    }).catch((err) => {
        res.sendStatus(500);
    });
}

function deleteUser(req, res, next) {
    userModels.deleteUser(parseInt(req.params.id)).then(() => {
        userModels.getUsers().then((users) => {
            res.render('users', { users });
        });
    }).catch((err) => {
        console.log("err");
        res.sendStatus(500);
    });
}

function loginUser(req, res, next) {
    try{
        res.render('login');
    } catch (err) {
        res.sendStatus(500);
    }
}

function registerUser(req, res, next) {
    userModels.getUserTableColumns()
        .then(column => res.render('register', {column}))
        .catch(error => console.log(error));
}

function registeredUser(req, res, next) {
    userModels.createUser(req.body, req.files).then((user) => {
        res.render('index', { title: 'Express' });
    }).catch((err) => {
        res.sendStatus(500);
    });
}

module.exports = {
    getUsers,
    getUserById,
    editUser,
    updateUser,
    addUser,
    createUser,
    deleteUser,
    loginUser,
    registerUser,
    registeredUser
}
