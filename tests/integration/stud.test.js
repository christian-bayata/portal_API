const request = require('supertest');
const bcrypt = require('bcrypt');
const { Student } = require('../../models/students');

let server;

describe('/api/students', () => {
    beforeEach(() => { server = require('../../app'); });
    afterEach(async () => {
        await server.close();
        await Student.remove({})
    });

    
    describe('GET /', () => {
        let student = new Student({
            name: 'student1',
            dept: 'dept1',
            level: 200,
            matricNo: 'csc/2012/035',
            password: 1111,
            noOfCoursesRegistered: 8,
            totalNoOfUnits: 16
        });
    
        it('should return all students in the database', async() => {
            await Student.collection.insertMany([
                { name: 'student1'},
                { name: 'student2'}
            ])

            const res = await request(server).get('/api/students');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some((std) => std.name === 'student1')).toBeTruthy();
            expect(res.body.some((std) => std.name === 'student2')).toBeTruthy();
        })
        it('should sort through the collection and return 200', async () => {
            const res = await request(server)
                    .get('/api/lecturers')
                    .send(student)
    
                student = await Student.find();
    
                expect(student).not.toBeNull()
        })
    })     
    describe('GET /:id', () => {
        let student = new Student({
            name: 'student1',
            dept: 'dept1',
            level: 200,
            matricNo: 'csc/2012/035',
            password: 1111,
            noOfCoursesRegistered: 8,
            totalNoOfUnits: 16
        });
    
        it('should return 400 if the id is not valid', async () => {
           const res = await request(server).get('/api/students/1');
           
           expect(res.status).toBe(400);
        });
        it('should return 200 if the id is valid', async () => {
            
            student = await student.save();

            const res = await request(server).get('/api/students/' + student._id);
            
            expect(res.status).toBe(200);
            expect(res.body.name).toMatch(student.name);
         });
    })

    describe('POST /', () => {
        let student = new Student({
            name: 'student1',
            dept: 'dept1',
            level: 200,
            matricNo: 'csc/2012/035',
            password: 1111,
            noOfCoursesRegistered: 8,
            totalNoOfUnits: 16
        });
    
        it('should return 400 if the character is less than 5', async () => {
            const res = await request(server)
                .post('/api/students')
                .send({ name: 'sss'})
            
            expect(res.status).toBe(400)
        });
        it('should return 400 if the character is greater than 50', async () => {
            const studentName = new Array(52)
            const res = await request(server)
                .post('/api/students')
                .send({ name: studentName })
            
            expect(res.status).toBe(400);
        });
        it('should return 400 if student selects a course multiple times', async () => {
           student = await student.save();

            const res = await request(server)
                .post('/api/students')
                .send({ name: 'student1', matricNo: 'csc/2012/035'})

            expect(res.status).toBe(400);     
        })
        it('should save student details if id is valid', async () => {

            const res = await request(server)
                .post('/api/lecturers')
                .send(student)

            student = await Student.find();

            expect(student).not.toBeNull()
        });
    })
})