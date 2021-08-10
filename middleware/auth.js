require('dotenv').config();
const config = require('config');
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send("Unauthorized user, access denied");  

    try {
        const decoded = jwt.verify(token, config.get('portalPrivateKey'));
        req.user = decoded;
        next();
    }
    catch(err) {
        res.status(400).send("Error! Could not verify token");
    };
};