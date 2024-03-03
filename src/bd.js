const { Pool } = require('pg');

const pool = new Pool({
  user: 'vadev', 
  host: 'localhost',
  database: 'epos', 
  password: '12345', 
  port: 9500, 
});

async function connectToPostgreSQL() {
  try {
    const client = await pool.connect();
    console.log('Connected to PostgreSQL');
   
  } catch (error) {
    console.error('Error connecting to PostgreSQL:', error);
  }
}

module.exports = { connectToPostgreSQL };
