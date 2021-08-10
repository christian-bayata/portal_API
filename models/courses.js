const mongoose = require('mongoose');
const Joi = require('joi')

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 10,
        maxlength: 50,
        required: true
    },
    code: {
        type: String,
        uppercase: true,
        minlength: 6,
        maxlength: 6,
        trim: true,
        required: true
    },
    noOfUnits: {  
        type: Number,
        required: true
    },
})

const Course = mongoose.model('Course', courseSchema);

function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        code: Joi.string().min(6).max(6).required(),
        noOfUnits: Joi.number().required()
    });
    return schema.validate(course);
};
    
exports.Course = Course;
exports.courseSchema = courseSchema;
exports.validate = validateCourse;