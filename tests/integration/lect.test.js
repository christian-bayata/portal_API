const mongoose = require('mongoose');
const request = require('supertest');
const { Lecturer } = require('../../models/lecturers');
const { Course } = require('../../models/courses')

let server;

describe('/api/lecturers', () => {
    beforeEach(() => { server = require('../../app')});
    afterEach(async () => { 
        server.close(),
        await Lecturer.remove({})
    });

    describe('GET /', () => {
        it('should return all lecturers', async() => {
            await Lecturer.collection.insertMany([
                { name: 'lecturer1'},
                { name: 'lecturer2'}
            ])
            const res = await request(server).get('/api/lecturers');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some((lect) => lect.name === 'lecturer1')).toBeTruthy();
            expect(res.body.some((lect) => lect.name === 'lecturer2')).toBeTruthy();
        })
    })
    
    describe('GET /:id', () => {
        it('should return 200 if id is valid', async() => {
            const lecturer = new Lecturer({ 
                name: 'lecturer1',
                titleId: mongoose.Types.ObjectId(),
                courseId: mongoose.Types.ObjectId(),
                noOfRegisteredStudents: 8,
                isAdmin: true 
            });
            await lecturer.save();
            
            const res = await request(server).get('/api/lecturers/' + lecturer._id);
            expect(res.status).toBe(200);
            expect(res.body.name).toMatch(lecturer.name);
        })
        it('should return 400 if id is not valid', async() => { 
            const res = await request(server).get('/api/lecturers/1');
            
            expect(res.status).toBe(400);
        })
    })

    describe('POST /', () => {
        it('should return 400 if the character is less than 5', async () => {
            const res = await request(server)
                .post('/api/lecturers')
                .send({ name: 'aaa' })
            expect(res.status).toBe(400) 
        })
        it('should return 400 if the character is greater than 50', async () => {
            const sampleName = new Array(52).join('a');
            const res = await request(server)
                .post('/api/lecturers')
                .send({ name: sampleName })
            expect(res.status).toBe(400) 
        })
        it('should return 400 if the course ID is invalid', async () => {
            const res = await request(server)
                .post('/api/lecturers')
                .send({ courseId: 1 })
            expect(res.status).toBe(400);
        });
        it('should return 400 if a lecturer picks a course more than once', async () => {
            courseObjectId = mongoose.Types.ObjectId()
            let lecturer = new Lecturer({
                name: 'lecturer1',
                courseId: courseObjectId,
                titleId: mongoose.Types.ObjectId(),
                noOfRegisteredStudents: 8,
                isAdmin: true 
            });
            await lecturer.save();

            const res = await request(server)
                .post('/api/lecturers')
                .send(lecturer)
            expect(res.status).toBe(400)
        });
        it('should save a lecturer if details are valid', async () => {
            
            let lecturer = new Lecturer({
                name: 'lecturer1',
                courseId: mongoose.Types.ObjectId(),
                titleId: mongoose.Types.ObjectId(),
                noOfRegisteredStudents: 8,
                isAdmin: true 
            });

            const res = await request(server)
                .post('/api/lecturers')
                .send(lecturer)

            lecturer = await Lecturer.find();

            expect(lecturer).not.toBeNull()
        });
    })
})