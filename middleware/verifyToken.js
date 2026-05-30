const jwt=require('jsonwebtoken');
require('dotenv').config({path: '../../.env'});

const verifytoken=  (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

// CHECK TOKEN
    if (!token) {
        return res.status(401).json({ error: 'Δεν παρέχεται token, κάνε πρώτα login' });
    }

// VERIFY TOKEN
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) =>{
        if (err){
            return res.status(403).json({ error: 'Μη έγκυρο token' });
        }
    
        req.user= decoded;
        next();
    });
    
};

module.exports = verifytoken;