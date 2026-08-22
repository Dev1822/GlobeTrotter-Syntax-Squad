// ---------------------------------------------------------
// MySQL Connection Pool (mysql2/promise)
// ---------------------------------------------------------
// Uses a connection pool so the app can handle concurrent
// requests without exhausting connections.
// ---------------------------------------------------------

const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host:     process.env.DB_HOST     || 'localhost',
    port:     process.env.DB_PORT     || 3306,
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME     || 'globetrotter',
    waitForConnections: true,
    connectionLimit:    10,
    queueLimit:         0,
});

module.exports = pool;
