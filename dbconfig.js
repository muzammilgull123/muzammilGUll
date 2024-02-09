const mysql = require('mysql');

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'githubhook',

};


const pool = mysql.createPool(dbConfig);


module.exports = pool;
