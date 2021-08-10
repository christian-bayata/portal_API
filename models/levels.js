const mongoose = require('mongoose');

const Level = mongoose.model('Level', new mongoose.Schema({
    level: {
        type: Number,
        required: true
    }   
}));

exports.Level = Level;
