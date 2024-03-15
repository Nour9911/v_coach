// config/config.js

const Pool = require('pg').Pool;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'vcoach',
  password: 'redsys',
  port: 5432,
});

module.exports = pool; // Export pool as the default export
