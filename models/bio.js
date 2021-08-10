const mongoose = require('mongoose');
const Joi = require('joi');

const bioSchema = new mongoose.Schema({
    dept: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true
    },
    code: {
        type: String,
        minlength: 3,
        maxlength: 3,
        uppercase: true,
        required: true
    }
});

const Bio = mongoose.model('Bio', bioSchema);

function validateBio(bio) {
    const schema = Joi.object({
        dept: Joi.string().min(5).max(255).required(),
        code: Joi.string().min(3).max(3).required(),
    });
    return schema.validate(bio)
};

exports.Bio = Bio;
exports.validate = validateBio;