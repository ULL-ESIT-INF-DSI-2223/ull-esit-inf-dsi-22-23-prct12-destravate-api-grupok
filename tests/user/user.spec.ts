import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../src/app.js';
import { User } from '../../src/models/user.js';

const firstUser = {
  name: "Yanfri",
  activities : "running", 
  trainingStatistics : {
    week : { km : 10,
      elevationGain : 100,
    },
    month : { km : 0,
      elevationGain : 0,
    },
    year : { km : 0,
      elevationGain : 0,
    },
  },
}

const userToAdd = {
  name: "Aday",
  activities : "running",
  trainingStatistics : {
    week : { km : 2,
      elevationGain : 1300,
    },
    month : { km : 4,
      elevationGain : 6,
    },
    year : { km : 6,
      elevationGain : 6,
    },
  },
}

beforeEach(async () => {
  await User.deleteMany();
  await new User(firstUser).save();
});


describe('POST /users', () => {
  it('Should successfully create a new user', async () => {
    const response = await request(app).post('/users').send(userToAdd).expect(201);
    expect(response.body).to.include({
      name: "Aday",
      activities : "running", 
    });

    expect(response.body.trainingStatistics).to.eql({
      week: { km: 2, elevationGain: 1300 },
      month: { km: 4, elevationGain: 6 },
      year: { km: 6, elevationGain: 6 }
    });
 
    const secondUser = await User.findById(response.body._id);
    expect(secondUser).not.to.be.null;
    expect(secondUser?.name).to.equal('Aday');
  });

  it('Should get an error', async () => {
    await request(app).post('/users').send(firstUser).expect(400);
  });

  it('Should get an error if the trainingStatistics are invalid', async () => {
    await request(app).post('/users').send({
      name: "Aday",
      activities : "running",
      trainingStatistics : {
        week : { km : "äsdasd",
          elevationGain : "soy una estadística mala",
        },
        month : { km : 4,
          elevationGain : 6,
        },
        year : { km : 6,
          elevationGain : 6,
        },
        invalid : "invalid",
      },
    }).expect(400);
  });

});


describe('GET /users', () => {
  it('Should get a user by username', async () => {
    const response = await request(app).get('/users?name=Yanfri').expect(200);
    expect(response.body[0]).to.include({
      name: 'Yanfri',
      activities : 'running', 
    });

    expect(response.body[0].trainingStatistics).to.eql({
      week: { km: 10, elevationGain: 100 },
      month: { km: 0, elevationGain: 0 },
      year: { km: 0, elevationGain: 0 }
    });

  });

  it('Should not find a user by username', async () => {
    await request(app).get('/users?name=NoSoyUsuarioDeLaBDD').expect(404);
  });
});


describe('GET /users/:id', () => {
  it('Should get a user by id', async () => {
    const awaitUser = await request(app).post('/users').send(userToAdd).expect(201);
    const response = await request(app).get(`/users/${awaitUser.body._id}`).expect(200);
    expect(response.body).to.include({
      name: 'Aday',
      activities : 'running', 
    });
  });
  
  it ('Should not get a user by id if the id does not exist', async () => {
    await request(app).get(`/users/ab5d342cf4d742296183ddb0`).expect(404);
  });

  it ('Should not get a user by id if is not valid', async () => {
    await request(app).get(`/users/idquenoexiste`).expect(500);
  });

});


describe('PATCH /users', () => {
  it('Should update a user by query', async () => {
    const response = await request(app).patch(`/users?name=Yanfri`).send({
                      activities : "cycling",
                    }).expect(200);
    expect(response.body).to.include({
      name: 'Yanfri',
      activities : 'cycling', 
    });
    const secondUser = await User.findById(response.body._id);
    expect(secondUser).not.to.be.null;
    expect(secondUser?.activities).to.equal('cycling');
  });

  it ('Should not update a user by query if does not exist', async () => {
    await request(app).patch(`/users?name=NoSoyUsuarioDeLaBDD`).send({
                      activities : "cicling",
                    }).expect(400);
  });
});


describe('PATCH /users/:id', () => {
  it('Should update a user by id', async () => {
    const awaitUser = await request(app).post('/users').send(userToAdd).expect(201);
    const response = await request(app).patch(`/users/${awaitUser.body._id}`).send({
                      activities : "cycling",
                    }).expect(200);

    expect(response.body).to.include({
      name: 'Aday',
      activities : 'cycling',
    });
    const secondUser = await User.findById(response.body._id);
    expect(secondUser).not.to.be.null;
    expect(secondUser?.activities).to.equal('cycling');
  });

  it ('Should not update a user by id if the id does not exist', async () => {
    await request(app).patch(`/users/ab5d342cf4d742296183d123`).send({
                      activities : "cycling",
                    }).expect(404);
  });

  it ('Should not update a user by id if is not valid', async () => {
    await request(app).patch(`/users/idquenoexiste`).send({
                      activities : "cycling",
                    }).expect(400);
  });
});


describe('DELETE /users', () => {
  it('Should delete a user by query', async () => {
    const response = await request(app).delete(`/users?name=Yanfri`).expect(200);
    expect(response.body).to.include({
      name: 'Yanfri',
      activities : 'running',
    });
    const secondUser = await User.findById(response.body._id);
    expect(secondUser).to.be.null;
  });

  it ('Should not delete a user by query if the user does not exist', async () => {
    await request(app).delete(`/users?name=NoSoyUsuarioDeLaBDD`).expect(404);
  });
});

describe('DELETE /users/:id', () => {
  it('Should delete a user by id', async () => {
    const awaitUser = await request(app).post('/users').send(userToAdd).expect(201);
    const response = await request(app).delete(`/users/${awaitUser.body._id}`).expect(200);
    expect(response.body).to.include({
      name: 'Aday',
      activities : 'running',
    });
  });

  it ('Should not delete a user by id if the id does not exist', async () => {
    await request(app).delete(`/users/ab5d342cf4d742296183d123`).expect(404);
  });

  it ('Should not delete a user by id if is not valid', async () => {
    await request(app).delete(`/users/idquenoexiste`).expect(500);
  });
});
  
after(async () => {
  await User.deleteMany();
});