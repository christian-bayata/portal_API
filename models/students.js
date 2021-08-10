require('dotenv').config();
const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Joi = require('joi');
const { min } = require('lodash');

const studSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 5,
        maxlength: 50,
        required: true
    },
    dept: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    matricNo: {
        type: String,
        minlength: 12,
        minlength: 12,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    noOfCoursesRegistered: {
        type: Number,
        required: true,
        min: 2,
        max: 20,
        required: true
    }, 
    totalNoOfUnits: {
        type: Number,
        required: true
    }
});

const Student = mongoose.model('Student', studSchema);

function validateStudent(student) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        dept: Joi.string().min(5).max(255).required(),
        level: Joi.number().required(),
        matricNo: Joi.string().min(12).max(12).required(),
        password: Joi.string().min(5).max(255).required(),
        noOfCoursesRegistered: Joi.number().min(2).max(20).required(),
        totalNoOfUnits: Joi.number().required()
    });
    return schema.validate(student);
};

exports.Student = Student;
exports.validate = validateStudent;
