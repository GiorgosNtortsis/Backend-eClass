const crypto = require('crypto');
const pool = require('../db');
require('dotenv').config({ path: '../.env' });

// CHANGE EMAIL FOR EVERY NEW TEACHER
const teacherEmail = 'nickxristou@uni.gr';
const adminName = 'admin';

// TOKEN GEN
function generateToken() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let token = 'TCH';
  for (let i = 0; i < 3; i++) {
    token += '-';
    for (let j = 0; j < 4; j++) {
      const randomIndex = crypto.randomInt(0, chars.length);
      token += chars[randomIndex];
    }
  }
  return token;
}

async function addTeacherEmail() {
  try {
    // CHECK IF EMAIL EXISTS
    const existing = await pool.query(
      'SELECT * FROM authorized_teachers WHERE email = $1',
      [teacherEmail]
    );

    if (existing.rows.length > 0) {
      console.log('Το email υπάρχει ήδη στη λίστα');
      console.log('Email:', existing.rows[0].email);
      console.log('Token:', existing.rows[0].invitation_token);
      process.exit();
    }

    // GEN TOKEN
    const token = generateToken();

    // ADDLIST
    const result = await pool.query(
      `INSERT INTO authorized_teachers (email, added_by, invitation_token) 
       VALUES ($1, $2, $3) RETURNING *`,
      [teacherEmail, adminName, token]
    );

    console.log('\n========================================');
    console.log('Καθηγητής προστέθηκε στη λίστα!');
    console.log('========================================');
    console.log('Email:', result.rows[0].email);
    console.log('Invitation Token:', result.rows[0].invitation_token);
    console.log('========================================');
    console.log('\n Δώσε αυτά τα στοιχεία στον καθηγητή.');
    console.log('   Θα τα χρειαστεί κατά την εγγραφή του.\n');

    process.exit();

  } catch (err) {
    console.error('Σφάλμα:', err.message);
    process.exit(1);
  }
}

addTeacherEmail();