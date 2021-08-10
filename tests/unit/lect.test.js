require('dotenv').config();
const config = require('config');
const jwt = require('jsonwebtoken');
const { Lecturer } = require('../../models/lecturers');
const mongoose = require('mongoose');
 
describe('lecturer.generateAuthToken', () => {
    it('should return a valid JWT', async () => {
        const payload = { _id: mongoose.Types.ObjectId().toHexString(), isAdmin: true}
        const lecturer = new Lecturer(payload);
        const token = lecturer.generateAuthToken();
        const decoded = await jwt.verify(token, config.get('portalPrivateKey')) 
        expect(decoded).toMatchObject(payload)
    });
});