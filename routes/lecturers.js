const validateObjectId = require('../middleware/validateObjectId');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { Lecturer, validate } = require('../models/lecturers');
const { Course } = require('../models/courses');
const { Title } = require('../models/titles');

    router.get('/', async (req, res) => {
    const lecturer = await Lecturer.find().sort('name');
        
    res.send(lecturer);
    });

    router.get('/:id', validateObjectId, async (req, res) => {
        const lecturer = await Lecturer.findById(req.params.id);
        if(!lecturer) return res.status(400).send('Invalid lecturer ID');

        res.send(lecturer);
    });

    router.post('/', async (req, res) => {
        const { error } = await validate(req.body);
        if(error) return res.status(400).send(error.details[0].message);

        const course = await Course.findById(req.body.courseId);
        if(!course) return res.status(400).send('Invalid Course ID');

        const title = await Title.findById(req.body.titleId);
        if(!title) return res.status(400).send('Please provide your title');
 
        let lecturer = await Lecturer.findOne({
            name: req.body.name,
            course: course
        });
        if(lecturer) return res.status(400).send('This lecturer has already been assigned this course');
 
        lecturer = new Lecturer({
            name: req.body.name,
            titleId: title.title,
            courseId: course,
            noOfRegisteredStudents: req.body.noOfRegisteredStudents,
            isAdmin: req.body.isAdmin
        });
        await lecturer.save(); 
        
        const token = lecturer.generateAuthToken();
        res.header('x-auth-token', token).send("Congratulations, you are now a registered lecturer");
    });

    router.put('/:id', async (req, res) => {

        const { error } = validate(req.body);
        if(error) return res.status(400).send(error.details[0].message);
 
        const course = await Course.findById(req.body.courseId);
        if(!course) return res.status(400).send('Invalid course ID provided');
        
        const title = await Title.findById(req.body.titleId);
        if(!title) return res.status(400).send('Invalid title ID provided');        
       
        let lecturer = await Lecturer.findById(req.params.id);
        if(!lecturer) return res.status(404).send('The lecturer with the provided ID is not found');

        lecturer.name = req.body.name;
        lecturer.title = title.title;
        lecturer.course = course.name;

        await lecturer.save();
        res.send(lecturer);
    });

    router.delete('/:id', async (req, res) => {
        let lecturer = await Lecturer.findById(req.params.id);
        if(!lecturer) return res.status(404).send('The lecturer with the provided ID is not found');

        await lecturer.deleteOne();
        res.send(lecturer);
    })

    module.exports = router;
