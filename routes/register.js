const _ = require('lodash');
const bcrypt = require('bcrypt');
const Fawn = require('fawn');
const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/isAdmin');
const auth = require('../middleware/auth');
const { User, validate } = require('../models/register');
const { Bio } = require('../models/bio');
const { Course } = require('../models/courses');
const { Student } = require('../models/students');
const { Lecturer } = require('../models/lecturers');

router.get('/', auth, async (req, res) => {
    const user = await User.find().sort('_id');

    res.send(user); 
});

router.post('/', auth, async(req, res) => {
    const { error } = await validate(req.body); 
    if(error) return res.status(400).send(error.details[0].message);

    const student = await Student.findById(req.body.studentId);
    if(!student) return res.status(400).send('Invalid student ID');

    const course = await Course.findById(req.body.courseId);
    if(!course) return res.status(400).send('Invalid course ID');

    const lecturer = await Lecturer.findById(req.body.lecturerId);
    if(!lecturer) return res.status(400).send('Invalid lecturer ID');

    //Ensure that a student does not register a course twice
    const reptChecker = await User.findOne({
        name: student.name,
        name: course.name
    })
    if(reptChecker) return res.status(400).send("Student has already chosen the course");

    let user = new User({
       student: {
           _id: student._id,
            name: student.name,
            dept: student.dept,
            level: student.level,
            matricNo: student.matricNo         
       },
       course: {
           _id: course._id,
            name: course.name,
            code: course.code           
        },
        lecturer: {
            _id: lecturer._id,
             name: lecturer.name           
         }, 
    }) 

    await user.save();

    student.noOfCoursesRegistered++;
    student.totalNoOfUnits += course.noOfUnits;   
    lecturer.noOfRegisteredStudents++;
    
    student.save(user);
    lecturer.save(user);
    
    res.send(user);
    
});

router.delete('/:id', [auth, isAdmin], async (req, res) => {

    let user = await User.findById(req.params.id);
    if(!user) return res.status(400).send("Invalid ID");

    const { error } = await validate(req.body); 
    if(error) return res.status(400).send(error.details[0].message);

    const student = await Student.findById(req.body.studentId);
    if(!student) return res.status(400).send('Invalid student ID');

    const course = await Course.findById(req.body.courseId);
    if(!course) return res.status(400).send('Invalid course ID');

    const lecturer = await Lecturer.findById(req.body.lecturerId);
    if(!lecturer) return res.status(400).send('Invalid lecturer ID');

    await user.deleteOne();

    student.noOfCoursesRegistered--;
    student.totalNoOfUnits -= course.noOfUnits;  

    if(lecturer.noOfRegisteredStudents  === 0) {
       return res.status(400).send('Cannot perform anymore delete functions');
    };

    lecturer.noOfRegisteredStudents--;
    
    student.save(user);
    lecturer.save(user);    

    res.send(user);
});

module.exports = router;
