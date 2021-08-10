const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();
const config = require('config');
require('express-async-errors');
const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const winston = require('winston');
const express = require('express');
const app = express();
const error = require('./middleware/error');
const lecturers = require('./routes/lecturers');
const students = require('./routes/students');
const courses = require('./routes/courses');
const register = require('./routes/register');
const bio = require('./routes/bio');
const auth = require('./routes/auth');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Initialize config
// if(!config.get('portalPrivateKey')) {
//     console.log('FATAL ERROR: Portal Private key is not defined');
//     process.exit(1);
// };

//Routes
app.use('/api/lecturers', lecturers);
app.use('/api/students', students);
app.use('/api/courses', courses);
app.use('/api/register', register);
app.use('/api/bio', bio);
app.use('/api/auth', auth);
app.use(helmet());
app.use(compression());
app.use(error);


//Database
const db = config.get('db');
    mongoose.connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
        })
    .then(() => winston.info(`Connected to ${db}`))
    .catch((err) => {winston.info(err.message, err)})

//Logger
winston.add(new winston.transports.File({
    filename: 'uncaughtExceptions.log',
    handleExceptions: true,
    level: 'error',
    format: winston.format.json()
}));

winston.add(new winston.transports.Console({
    handleExceptions: true,
    level: 'info',
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
)}));

winston.add(new winston.transports.File({
    filename: 'unhandledRejections.log',
    unhandledRejections: true,
}));

//Port
const port = process.env.PORT || 5000
let server = app.listen(port, () => winston.info(`Server is currently running on ${port}`));

module.exports = server;
