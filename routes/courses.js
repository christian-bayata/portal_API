const validateObjectId = require('../middleware/validateObjectId');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { Course, validate } = require('../models/courses');

router.get('/', async (req, res) => {
    const course = await Course.find().sort('name');
    res.send(course); 
});

router.get('/:id', validateObjectId, async (req, res) => {
    const course = await Course.findById(req.params.id);
    if(!course) return res.status(400).send('Invalid Course ID');

    res.send(course);
});

router.post('/', async (req, res) => {
    const { error } = await validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
  
    let course = new Course({
        name: req.body.name,
        code: req.body.code,
        noOfUnits: req.body.noOfUnits
    });

    await course.save()

    res.send(course);
});

router.put('/:id', async (req, res) => {
    const { error } = await validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    const course = await Course.findById(req.params.id);
    if(!course) return res.status(400).send('Invalid course ID');

    course.name = req.body.name;
    course.code = req.body.code;
    course.noOfUnits = req.body.noOfUnits;

    await course.save();

    res.send(course);
});

router.delete('/:id', async (req, res) => {
    const course = await Course.findById(req.params.id);
    if(!course) return res.status(400).send('Invalid course ID');
    
    await course.deleteOne();

    res.send(course);
});

module.exports = router;