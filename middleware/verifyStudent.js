const verifyStudent=(req, res, next)=>{
    //check student role
    if (req.user.role !== 'student') {
        return res.status(403).json({ error: 'Πρόσβαση μόνο για τους φοιτητές'});
    }

    next();
}

module.exports=verifyStudent;
