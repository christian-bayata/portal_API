require('dotenv').config();
const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { titleSchema } = require('../models/titles');
const { courseSchema } = require('../models/courses');

const lectSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 5,
        maxlength: 50,
        required: true
    },
    titleId: { 
        type: {titleSchema},
        required: true
    },
    courseId: {
        type: {courseSchema},
        required: true
    }, 
    noOfRegisteredStudents: {
        type: Number,
        min: 0,
        max: 1024,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: true,
        required: true
    }
});

lectSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin}, config.get('portalPrivateKey'));
    return token 
};


const Lecturer = mongoose.model('Lecturer', lectSchema);

function validateLecturer(lecturer) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        titleId: Joi.objectId().required(),
        courseId: Joi.objectId().required(),
        noOfRegisteredStudents: Joi.number().min(0).max(1024).required(),
        isAdmin: Joi.boolean().invalid(false)
    });
    return schema.validate(lecturer);
};

exports.Lecturer = Lecturer;
exports.validate = validateLecturer;