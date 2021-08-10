const validateObjectId = require('../middleware/validateObjectId'); 
const _ = require('lodash');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { Student, validate } = require('../models/students');

router.get('/', async (req, res) => {
    const students = await Student.find().sort('name');

    res.send(students);
});

router.get('/:id', validateObjectId, async(req, res) => {
    const student = await Student.findById(req.params.id);
    if(!student) return res.status(400).send('Invalid ID');

    res.send(student)
})

router.post('/', async (req, res) => {
    const { error } = await validate(req.body);
    if(error) res.status(400).send(error.details[0].message);

    let student = await Student.findOne({
        name: req.body.name,
        matricNo: req.body.matricNo
    }); 

    if(student) return res.status(400).send('Course has already been chosen by the student');

    student = new Student(_.pick(req.body, [ 'name', 'dept', 'level', 'matricNo', 'password', 'noOfCoursesRegistered', 'totalNoOfUnits']));

    const salt = await bcrypt.genSalt(10); 
    student.password = await bcrypt.hash(student.password, salt);

    await student.save();

    return res.send(_.pick(req.body, [ 'name', 'dept', 'level', 'matricNo', 'noOfCoursesRegistered', 'totalNoOfUnits']));
})

router.put('/:id', async (req, res) => {
    const { error } = await validate(req.body);
    if(error) res.status(400).send(error.details[0].message);

    const course = await Course.findById(req.body.courseId);
    if(!course) return res.status(400).send('Invalid course ID provided');

    const level = await Level.findById(req.body.levelId);
    if(!level) return res.status(400).send('Invalid level ID provided'); 

    const student = await Student.findById(req.params.id)
    if(!student) return res.status(400).send('The student ID provided does not exist');

    student.name = req.body.name;
    student.course = course.name;

    await student.save();
    res.send(student);
}); 

router.delete('/:id', async (req, res) => {
    let student = await Student.findById(req.params.id);
    if(!student) return res.status(404).send('The student with the provided ID is not found');

    await student.deleteOne();
    res.send(student);
})

module.exports = router;
