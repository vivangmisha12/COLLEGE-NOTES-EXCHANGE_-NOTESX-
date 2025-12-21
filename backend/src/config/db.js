import dotenv from 'dotenv';
dotenv.config();
import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "collegenotesdb",
  port: 3306,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default db;
