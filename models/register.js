require('dotenv').config();
const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const lecturer = require('../models/lecturers'); 

const userSchema = new mongoose.Schema({
    student: { 
        type: new mongoose.Schema({
            name: {
                type: String,
                minlength: 5,
                maxlength: 255,
                required: true
            },
            dept: {
                type: String, 
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
        }),
        required: true
    },
    course: {
        type: new mongoose.Schema({
            name: {
                type: String,
                minlength: 5,
                maxlength: 255,
                required: true
            },
            code: {
                type: String,
                minlength: 6,
                maxlength: 6,
                required: true
            },
        }),
        required: true
    },
    lecturer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                minlength: 5,
                maxlength: 255,
                required: true
            },     
        }), 
        required: true 
    }
});

const User = mongoose.model('User', userSchema);

function validateUser(user) { 
    const schema = Joi.object({
        studentId: Joi.objectId().required(),
        courseId: Joi.objectId().required(),
        lecturerId: Joi.objectId().required()    
    });
    return schema.validate(user)
};

exports.User = User;
exports.validate = validateUser;