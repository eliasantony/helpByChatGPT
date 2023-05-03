require('dotenv').config();
const mysql = require('mysql');

const config = mysql.createConnection({
    host: "atp.fhstp.ac.at",
    port: "8007",
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

config.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

module.exports = {config};