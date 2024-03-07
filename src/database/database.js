
const { Pool } = require('pg');

const pool = new Pool({
    user: "vadev",
    password: "12345",
    host: "localhost",
    port: "9123",
    database: "epos"
});

module.exports = pool;

