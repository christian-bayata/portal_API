const request = require('supertest');
const { Course } = require('../../models/courses');

let server; 

describe('/api/courses', () => {
    beforeEach(() => { server = require('../../app')});
    afterEach(async () => { 
        server.close(),
        await Course.remove({})
    });

    describe('GET /', () => {
        it('should return all courses', async() => {
            await Course.collection.insertMany([
                { name: 'course1'},
                { name: 'course2'}
            ])
            const res = await request(server).get('/api/courses');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some((lect) => lect.name === 'course1')).toBeTruthy();
            expect(res.body.some((lect) => lect.name === 'course2')).toBeTruthy();
        });
        it('should return courses that are saved in the database', async () => {
            let course = new Course({
                name: 'course1',
                code: 'csc',
                noOfUnits: 3
            });

            const res = await request(server).get('/api/courses')
            course = await Course.find();
            expect(course).not.toBeNull();
        })
    })
    describe('GET /:id', () => {
        it('should return 400 if course id is not valid', async () => {
            const res = await request(server).get('/api/courses/1');
            expect(res.status).toBe(400);
        })
        it('should return 200 if course id is valid', async () => {
            const course = new Course({
                name: 'Algorithms',
                code: 'CSC305',
                noOfUnits: 3 
            });
            await course.save();
            const res = await request(server).get('/api/courses/' + course._id);
            expect(course).not.toBeNull();
            expect(res.body.name).toMatch(course.name);
        });
    })
    describe('POST /', () => {
        it('should return 400 if the inputed course is less than 5 characters', async () => {
            const res = await request(server)
                .post('/api/courses')
                .send({ name: 'aaa' })
            expect(res.status).toBe(400) 
        });
        it('should return 400 if the inputed course is more than 50 characters', async () => {
            const courseName = new Array(52).join('a');
            const res = await request(server)
                .post('/api/courses')
                .send({ name: courseName })
            expect(res.status).toBe(400) 
        });
        it('should return course that is saved in the databsae', async () => {
            const course = new Course({
                name: 'Algorithms',
                code: 'CSC305',
                noOfUnits: 3 
            });
            const res = await request(server)
                .post('/api/courses')
                .send(course)
            await Course.find()
            expect(course).not.toBeNull();
        })
    })
})    