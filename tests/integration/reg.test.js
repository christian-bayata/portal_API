const request = require('supertest');
require('dotenv').config();
const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const {User} = require('../../models/register');
const {Student} = require('../../models/students');
const {Course} = require('../../models/courses');

let server;

describe('/api/register', () => {

    beforeEach(() => { server = require('../../app')});
    afterEach(async () => { 
        server.close(),
        await User.remove({})
    });

    let token;

    describe('GET /', () => {

        beforeEach(() => {
            token = jwt.sign({ _id: this._id }, config.get('portalPrivateKey'), { expiresIn: '1d'});
        });

        it('should return all registered students', async() => {

            await User.collection.insertMany([
                { name: 'register1'},
                { name: 'register2'}
            ])
            const res = await request(server)
            .get('/api/register')
            .set('x-auth-token', token)
    
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
        });
    })
    describe('POST /', () => {
        
        const user = new User({
            student: {
                _id: mongoose.Types.ObjectId().toHexString(),
                    name: 'student1',
                    dept: 'student dept',
                    level: 300,
                    matricNo: 'CSC/2012/035'         
            },
            course: {
                _id: mongoose.Types.ObjectId().toHexString(),
                    name: 'Algorthms',
                    code: 'CSC302'           
            },
                lecturer: {
                    _id: mongoose.Types.ObjectId().toHexString(),
                    name: 'lecturer1'           
            }, 
        })

        it('should return 400 if student id is not valid', async() => {
        
            const res = await request(server)
                .post('/api/register')
                .set('x-auth-token', token)
                .send({ _id: 1 });
            
            expect(res.status).toBe(400)
        });
        it('should return 400 if course id is not valid', async() => {
        
            const res = await request(server)
                .post('/api/register')
                .set('x-auth-token', token)
                .send({ courseId: 1 });
            
            expect(res.status).toBe(400)
        });
        it('should return 400 if lecturer id is not valid', async() => {
        
            const res = await request(server)
                .post('/api/register')
                .set('x-auth-token', token)
                .send({ lecturerId: 1 });
            
            expect(res.status).toBe(400)
        });
        it('should return 400 if the student registers a course more than once', async () => {
            
            await user.save()

            const res = await request(server)
                .post('/api/register')
                .set('x-auth-token', token)
                .send({ name: 'student1', name: 'Algorithms'})
            expect(res.status).toBe(400)
        })
        it('should save student details if input is valid', async () => {

            const res = await request(server)
                .post('/api/register')
                .set('x-auth-token', token)
                .send(user)
                
            expect(res.user).not.toBeNull();
        })
    })
})