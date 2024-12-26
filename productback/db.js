require('dotenv').config();
const { Pool } = require('pg');

// Create a new PostgreSQL connection pool using environment variables
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test the database connection using the pool
pool.connect()
  .then((client) => {
    console.log("Connected to the database using pool!");
    
    // Optionally, run a test query
    return client.query('SELECT NOW()')
      .then((res) => {
        console.log("Current time:", res.rows[0].now); // Access the current time from the query result
        client.release();  // Release the client back to the pool
      })
      .catch((err) => {
        console.error('Error during query execution:', err.stack);
        client.release();  // Ensure the client is released even after error
      });
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err.stack);
  });

// Export the pool for use in other files
module.exports = pool;
