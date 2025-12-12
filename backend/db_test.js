// backend/db_test.js
require('dotenv').config(); 
const mysql = require('mysql2/promise'); // Using the promise version is fine

console.log("Attempting connection with:");
console.log(`Host: ${process.env.DB_HOST}, User: ${process.env.DB_USER}, DB: ${process.env.DB_NAME}`);

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 1
});

pool.getConnection()
    .then(connection => {
        console.log("\n🟢 SUCCESS! Database connection established. 🟢");
        connection.release();
        process.exit(0); // Exit successfully
    })
    .catch(err => {
        console.error("\n🔴 FATAL ERROR: Database connection failed! 🔴");
        console.error("Code:", err.code);
        console.error("Message:", err.message);
        console.error("\nFIX HINTS: Check 1) MySQL service is running. 2) Password in backend/.env.");
        process.exit(1); // Exit with error
    });