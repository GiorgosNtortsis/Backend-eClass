const express=require('express');
const pool=require('../db');
const verifyToken=require('../middleware/verifyToken');
const verifyTeacher=require('../middleware/verifyTeacher');
const router=express.Router();

router.use(verifyToken);
router.use(verifyTeacher);

router.post('/create-course', async (req, res)=>{
    try{
        const {title, description}= req.body;
        const teacherId= req.user.id;

        //CHECK FOR TITLE
        if (!title){
            return res.status(400).json({ error: 'Ο τίτλος του μαθήματος είναι υποχρεωτικός' });
        }

        //SAVE COURSE
        const newCourse= await pool.query(
            `INSERT INTO courses (title, description, teacher_id)
            VALUES ($1, $2, $3) RETURNING *`,
            [title, description, teacherId]
        );

        res.status(201).json({
            message: 'Το μάθημα δημιουργήθηκε με επιτυχία',
            course: newCourse.rows[0]
        });

    } catch (err){
        res.status(500).json({ error: err.message});
    }
    });

    // My Courses
    router.get('/my-courses', async (req, res)=>{
        try{
            const teacherId= req.user.id;

            const courses = await pool.query(
                `SELECT * FROM courses WHERE teacher_id = $1 ORDER BY created_at DESC`,
                [teacherId]
            );

            res.json(courses.rows);

        } catch (err){
            res.status(500).json({ error: err.message });
        }

    });

    module.exports=router;

      