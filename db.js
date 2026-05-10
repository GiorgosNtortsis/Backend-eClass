const { Pool } = require('pg');
require('dotenv').config({path: '../.env'});

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

pool.connect((err, client, release) => {
    if (err) {
        console.error('Σφάλμα Σύνδεσης Βάσης Δεδομένων', err.message);
        return;
    }

    console.log('Eπιτυχής Σύνδεση Βάσηw Δεδομένων');
    release();
});

module.exports = pool;