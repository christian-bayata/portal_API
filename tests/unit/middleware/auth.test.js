const {User} = require('../../../models/register');
const auth = require('../../../middleware/auth');
require('dotenv').config();
const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

describe('auth middleware', () => {
    it('should populate req.user with the decoded payload of JWT', async () => {
        const user = {
            _id: mongoose.Types.ObjectId().toHexString(),
            isAdmin: true
        };
        const token = jwt.sign(user, config.get('portalPrivateKey'));
        const req = {
            header: jest.fn().mockReturnValue(token)
        };
        const res = {};
        const next = jest.fn();
        
        auth(req, res, next);

        expect(req.user).toBeDefined();
        expect(req.user).toMatchObject(user);
    })
})