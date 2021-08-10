const mongoose = require('mongoose');

const titleSchema = new mongoose.Schema({
    title: {
        type: String,
        minlength: 5,
        maxlength: 50,
        required: true
    }   
})

const Title = mongoose.model('Title', titleSchema);

exports.Title = Title;
exports.titleSchema = titleSchema;
