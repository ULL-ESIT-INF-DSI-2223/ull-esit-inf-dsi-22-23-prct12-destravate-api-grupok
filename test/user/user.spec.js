import request from 'supertest';
import { app } from '../../src/app.js';
import { User } from '../../src/models/user.js';
const firstUser = {
    name: "Yanfri",
    activities: "running",
    trainingStatistics: {
        week: { km: 10,
            elevationGain: 100,
        },
        month: { km: 0,
            elevationGain: 0,
        },
        year: { km: 0,
            elevationGain: 0,
        },
    },
};
beforeEach(async () => {
    await User.deleteMany();
    await new User(firstUser).save();
});
describe('POST /users', () => {
    it('Should successfully create a new user', async () => {
        await request(app).post('/users').send({
            name: "Alejandro Marrero",
            username: "amarrerd",
            email: "amarrerd@example.com",
        }).expect(201);
    });
    it('Should get an error', async () => {
        await request(app).post('/users').send(firstUser).expect(500);
    });
});
describe('GET /users', () => {
    it('Should get a user by username', async () => {
        await request(app).get('/users?username=esegredo').expect(200);
    });
    it('Should not find a user by username', async () => {
        await request(app).get('/users?username=edusegre').expect(404);
    });
});
