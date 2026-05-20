const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
require('dotenv').config({ path: '../../.env' });

const router = express.Router();

// 
// REGISTER 
// 
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, invitationToken } = req.body;

    // checkitems
    if (!name || !email || !password) {
      return res.status(400).json({ 
        error: 'Όλα τα πεδία είναι υποχρεωτικά' 
      });
    }

    // checklengthpass
    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες' 
      });
    }


    // check alrd-user with this email
    const existingUser = await pool.query( 
      'SELECT * FROM users WHERE email = $1', 
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ 
        error: 'Υπάρχει ήδη χρήστης με αυτό το email' 
      });
    }

    // Email check ++ role assign
      const emailDomain = email.split('@')[1];
      
      let userRole;
      if(invitationToken) {
        if (emailDomain !== 'uni.gr'){
          return res.status(400).json({ error: 'Email μόνο με κατάληξη uni.gr για καθηγητές' });
        }

        const tokenCheck = await pool.query(
          `SELECT * FROM authorized_teachers
          WHERE email= $1 AND invitation token= $2 and is_used= false`
          [email, invitationToken]
        );
          
        if (tokenCheck.rows.length === 0) {
          return res.status(400).json({ error: 'Μη έγκυρο token'});
        }

        userRole= 'teacher';

      } else{
        if (emailDomain === 'uni.gr'){
          return res.status(400).json ({error: 'Email με κατάληξη students.uni.gr για φοιτητές'});
        }
        userRole= 'student';
      }
         

    // cryptopassword
    const hashedPassword = await bcrypt.hash(password, 10);

    // saveuser
    const newUser = await pool.query(
      `INSERT INTO users (name, email, password, role) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, name, email, role`,
      [name, email, hashedPassword, userRole]
    );

    // refresh teacher status mark token
    if (userRole === 'teacher') {
      await pool.query(
        'UPDATE authorized_teachers SET is_used = true WHERE email = $1',
        [email]
      );
    }

    res.status(201).json({
      message: 'Επιτυχής εγγραφή!',
      user: newUser.rows[0]
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//
// LOGIN
// 
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // checkitems
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email και κωδικός είναι υποχρεωτικά πεδία' 
      });
    }

    // searchuser
    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ 
        error: 'Λάθος email ή κωδικός' 
      });
    }

    const user = userResult.rows[0];

    // password check
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ 
        error: 'Λάθος email ή κωδικός' 
      });
    }

    // JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    // recsession
    await pool.query(
      'INSERT INTO sessions (user_id, ip_address) VALUES ($1, $2)',
      [user.id, req.ip]
    );

    res.json({
      message: 'Επιτυχής σύνδεση!',
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;