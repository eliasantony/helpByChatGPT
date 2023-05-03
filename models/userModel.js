const db = require('../services/database.js').config;
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
require('body-parser');

let getUsers = () => new Promise((resolve, reject) => {
    db.query('SELECT * FROM users', function (err, result, fields) {
        if (err) reject(err);
        resolve(result);
    });
});

let getUserById = (id) => new Promise((resolve, reject) => {
    db.query('SELECT * FROM users WHERE id = ' + parseInt(id), function (err, result, fields) {
        if (err) reject(err);
        resolve(result[0]);
    });
});

let updateUser = (userData, reqFiles) => new Promise((resolve, reject) => {
    let sql = "UPDATE users SET" +
        " name = "+ db.escape(userData.name) +
        ", surname = "+ db.escape(userData.surname) +
        ", hero = "+ db.escape(userData.hero) +
        ", email = "+ db.escape(userData.email) +
        ", info = "+ db.escape(userData.info) +
        (!reqFiles ? "" : ", avatarPath = " + db.escape(reqFiles.avatar.name)) +
        ", password = "+ db.escape(userData.password) +
        " WHERE id = " + parseInt(userData.id);

    console.log(sql);
    // console.log(reqFiles.avatar.name);

    if (reqFiles) {
        uploadAvatarToServer(reqFiles, reject);
    }

    updateUserInDatabase(sql, reject, resolve, userData);
});

let createUser = (userData, reqFiles) => new Promise((resolve, reject) => {

    let sql = "INSERT INTO users (name, surname, hero, email, info, avatarPath) VALUES (" +
        db.escape(userData.name) + ", " +
        db.escape(userData.surname) + ", " +
        db.escape(userData.hero) + ", " +
        db.escape(userData.email) + ", " +
        db.escape(userData.info) + ", " +
        (!reqFiles ? db.escape("") : db.escape(reqFiles.avatar.name)) + ", " +
        db.escape(userData.password) + ")";

    console.log(sql);

    if (reqFiles) {
        uploadAvatarToServer(reqFiles, reject);
    }
    createUserInDatabase(sql, reject, resolve, userData);
});

function uploadAvatarToServer(reqFiles, reject) {
    let filename = './public/avatars/' + reqFiles.avatar.name;
    reqFiles.avatar.mv(filename, function (err) {
        if (err) {
            reject(err);
        }
        console.log('File uploaded!');
    });
}

function updateUserInDatabase(sql, reject, resolve, userData) {
    db.query(sql, function (err, result, fields) {
        if (err) {
            reject(err)
        }
        // console.log(result.affectedRows + " rows have been affected")
        resolve(userData)
    });
}

function createUserInDatabase(sql, reject, resolve, userData) {
    db.query(sql, function (err, result, fields) {
        if (err) {
            reject(err)
        }
        console.log("1 record inserted");
        resolve(userData);
    });
}

let deleteUser = (id) => new Promise((resolve, reject) => {
    db.query("DELETE FROM users WHERE id = " + parseInt(id), function (err, result, fields) {
        if (err) reject(err);
        resolve(result);
    });
});

let getUserTableColumns = () => new Promise((resolve, reject) => {
    db.query('SHOW COLUMNS FROM users', function (err, columns, fields) {
        if (err) reject(err);
        resolve(columns);
    });
});

module.exports = {
    getUsers,
    getUserById,
    updateUser,
    createUser,
    deleteUser,
    getUserTableColumns,
    createUserInDatabase
}
