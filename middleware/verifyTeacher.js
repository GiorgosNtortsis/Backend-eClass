const verifyTeacher=(req, res, next)=>{
    //CHECK TEACHER ROLE
    if (req.user.role !== 'teacher'){
        return res.status(403).json({ error: 'Πρόσβαση μόνο για τους καθηγητές'});
    }

next();
}

module.exports=verifyTeacher;

