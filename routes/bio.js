const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { Bio, validate } = require('../models/bio');

router.get('/', async (req, res) => {
    const bio = await Bio.find().sort('idNo');

    res.send(bio);
});

router.post('/', async (req, res) => {
    const { error } = await validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let bio = new Bio({
        dept: req.body.dept,
        code: req.body.code,
    });

    await bio.save();
    res.send(bio);
});

module.exports = router;