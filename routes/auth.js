require('dotenv').config();
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const { Student } = require('../models/students');

router.post('/', async(req, res) => {
    const { error } = await validate(req.body);
    if(error) return res.status(400).send('Invalid input');

    let student = await Student.findOne({ matricNo: req.body.matricNo });
    if(!student) return res.status(400).send('This Id does not exist');

    const validatePassword = await bcrypt.compare(req.body.password, student.password);
    if(!validatePassword) return res.status(400).send('password match failed');

    const token = jwt.sign({ _id: this._id }, config.get('portalPrivateKey'), { expiresIn: '1d'});
    res.header('x-auth-token', token).send("Congratulations! You have successfully logged in");
});

function validate(req) {
    const schema = Joi.object({
        matricNo: Joi.string().min(5).max(255).required(),
        password: Joi.string().min(5).max(255).required()
    });
    return schema.validate(req)
};

module.exports = router;