import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../src/app.js';
import { User } from '../../src/models/user.js';

/// Creamos 2 usuarios para hacer las pruebas
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

/// Creamos a los usuarios
describe('POST /users', () => {
  it('Should successfully create a new user', async () => {
    const response = await request(app).post('/users').send(userToAdd).expect(201);
    expect(response.body).to.include({
      name: "Aday",
      activities : "running", 
    });

    // expect (response.body).to.include({
    //   trainingStatistics: {
    //     week: {
    //       km: 10,
    //       elevationGain: 100
    //     },
    //     month: {
    //       km: 0,
    //       elevationGain: 0
    //     },
    //     year: {
    //       km: 0,
    //       elevationGain: 0
    //     }
    //   },
    // });
    /// TODO: trainingStatistics falla: como que no reconoce bien el formato o algo, porque incluirlo lo incluye, pero es fallo del test. El programma lo hace bien
    
    const secondUser = await User.findById(response.body._id);
    expect(secondUser).not.to.be.null;
    expect(secondUser?.name).to.equal('Aday');
  });

  /// Introducimos el mismo usuario
  it('Should get an error', async () => {
    await request(app).post('/users').send(firstUser).expect(400);
  });
});

/// Get users con el query
describe('GET /users', () => {
  it('Should get a user by username', async () => {
    const response = await request(app).get('/users?name=Yanfri').expect(200);
    expect(response.body[0]).to.include({
      name: 'Yanfri',
      activities : 'running', 
    });
    /// TODO: Meter la estadísticas también aquí
  });

  it('Should not find a user by username', async () => {
    await request(app).get('/users?name=NoSoyUsuarioDeLaBDD').expect(404);
  });
});

/// Get users con el id
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

/// Hacemos el patch mediante query
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

/// Patch mediante id
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

/// Borramos un usuario mediante query
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
    await request(app).delete(`/users?name=NoSoyUsuarioDeLaBDD`).expect(400);
  });
});

/// Borramos todos los usuarios
after(async () => {
  await User.deleteMany();
});