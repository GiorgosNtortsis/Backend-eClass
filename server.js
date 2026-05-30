const express= require('express');
const cors= require('cors');
require('dotenv').config({path: '../.env'});

const pool=require('./db');
const authRoutes = require('./routes/auth');
const teacherRoutes= require('./routes/teacher');

const app=express();
const PORT=process.env.PORT || 3000;

// MDLWR
app.use(cors());
app.use(express.json());

// ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/teacher', teacherRoutes);

//TSTDBRT
app.get('/',(req, res)=>{
    res.send('Welcome to eClass');
});

app.get('/test-db',async(req,res)=>{
    try{
        const result=await pool.query('SELECT NOW()');
        res.json({
            message:'Database connection successful',
            time: result.rows[0].now

        });

    }catch(err){
        res.status(500).json({error: err.message});

    }
});

//STARTSRV
app.listen(PORT,()=>{
    console.log(`Server is running on port http://localhost:${PORT}`);
});

