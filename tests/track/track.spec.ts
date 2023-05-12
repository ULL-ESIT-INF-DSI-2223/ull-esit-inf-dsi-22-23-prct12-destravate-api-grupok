import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../src/app.js';
import { Track } from '../../src/models/track.js';

const firstTrack = {
  name: "Ironman",
  startCoordinates: [12,12],
  endCoordinates: [23,25],
  length: 44,
  grade: 6,
  activities: "running",
  rating: 4.3
}

const trackToAdd = {
  name: "Decathlon",
  startCoordinates: [10,10],
  endCoordinates: [22,30],
  length: 60,
  grade: 8,
  activities: "running",
  rating: 5
}

beforeEach(async () => {
  await Track.deleteMany();
  await new Track(firstTrack).save();
});

describe('POST /tracks', () => {
  it('Should successfully create a new track', async () => {
    const response = await request(app).post('/tracks').send(trackToAdd).expect(201);
    expect(response.body).to.include({
      name: "Decathlon",
      length: 60,
      grade: 8,
      activities: "running",
      rating: 5
    });
    console.log(response.body.startCoordinates);
    expect (response.body.startCoordinates).to.eql([10,10]);
    expect (response.body.endCoordinates).to.eql([22,30]);
 
    const secondTrack = await Track.findById(response.body._id);
    expect(secondTrack).not.to.be.null;
    expect(secondTrack?.name).to.equal('Decathlon');
  });

  it('Should get an error if try to insert a track that is already in DB', async () => {
    await request(app).post('/tracks').send(firstTrack).expect(400);
  });
});


// describe('GET /users', () => {
//   it('Should get a user by username', async () => {
//     const response = await request(app).get('/users?name=Yanfri').expect(200);
//     expect(response.body[0]).to.include({
//       name: 'Yanfri',
//       activities : 'running', 
//     });

//     expect(response.body[0].trainingStatistics).to.eql({
//       week: { km: 10, elevationGain: 100 },
//       month: { km: 0, elevationGain: 0 },
//       year: { km: 0, elevationGain: 0 }
//     });

//   });

//   it('Should not find a user by username', async () => {
//     await request(app).get('/users?name=NoSoyUsuarioDeLaBDD').expect(404);
//   });
// });


// describe('GET /users/:id', () => {
//   it('Should get a user by id', async () => {
//     const awaitUser = await request(app).post('/users').send(trackToAdd).expect(201);
//     const response = await request(app).get(`/users/${awaitUser.body._id}`).expect(200);
//     expect(response.body).to.include({
//       name: 'Aday',
//       activities : 'running', 
//     });
//   });
  
//   it ('Should not get a user by id if the id does not exist', async () => {
//     await request(app).get(`/users/ab5d342cf4d742296183ddb0`).expect(404);
//   });

//   it ('Should not get a user by id if is not valid', async () => {
//     await request(app).get(`/users/idquenoexiste`).expect(500);
//   });

// });


// describe('PATCH /users', () => {
//   it('Should update a user by query', async () => {
//     const response = await request(app).patch(`/users?name=Yanfri`).send({
//                       activities : "cycling",
//                     }).expect(200);
//     expect(response.body).to.include({
//       name: 'Yanfri',
//       activities : 'cycling', 
//     });
//     const secondUser = await User.findById(response.body._id);
//     expect(secondUser).not.to.be.null;
//     expect(secondUser?.activities).to.equal('cycling');
//   });

//   it ('Should not update a user by query if does not exist', async () => {
//     await request(app).patch(`/users?name=NoSoyUsuarioDeLaBDD`).send({
//                       activities : "cicling",
//                     }).expect(400);
//   });
// });


// describe('PATCH /users/:id', () => {
//   it('Should update a user by id', async () => {
//     const awaitUser = await request(app).post('/users').send(trackToAdd).expect(201);
//     const response = await request(app).patch(`/users/${awaitUser.body._id}`).send({
//                       activities : "cycling",
//                     }).expect(200);

//     expect(response.body).to.include({
//       name: 'Aday',
//       activities : 'cycling',
//     });
//     const secondUser = await User.findById(response.body._id);
//     expect(secondUser).not.to.be.null;
//     expect(secondUser?.activities).to.equal('cycling');
//   });

//   it ('Should not update a user by id if the id does not exist', async () => {
//     await request(app).patch(`/users/ab5d342cf4d742296183d123`).send({
//                       activities : "cycling",
//                     }).expect(404);
//   });

//   it ('Should not update a user by id if is not valid', async () => {
//     await request(app).patch(`/users/idquenoexiste`).send({
//                       activities : "cycling",
//                     }).expect(400);
//   });
// });


// describe('DELETE /users', () => {
//   it('Should delete a user by query', async () => {
//     const response = await request(app).delete(`/users?name=Yanfri`).expect(200);
//     expect(response.body).to.include({
//       name: 'Yanfri',
//       activities : 'running',
//     });
//     const secondUser = await User.findById(response.body._id);
//     expect(secondUser).to.be.null;
//   });

//   it ('Should not delete a user by query if the user does not exist', async () => {
//     await request(app).delete(`/users?name=NoSoyUsuarioDeLaBDD`).expect(404);
//   });
// });

// describe('DELETE /users/:id', () => {
//   it('Should delete a user by id', async () => {
//     const awaitUser = await request(app).post('/users').send(trackToAdd).expect(201);
//     const response = await request(app).delete(`/users/${awaitUser.body._id}`).expect(200);
//     expect(response.body).to.include({
//       name: 'Aday',
//       activities : 'running',
//     });
//   });

//   it ('Should not delete a user by id if the id does not exist', async () => {
//     await request(app).delete(`/users/ab5d342cf4d742296183d123`).expect(404);
//   });

//   it ('Should not delete a user by id if is not valid', async () => {
//     await request(app).delete(`/users/idquenoexiste`).expect(500);
//   });
// });
  
after(async () => {
  await Track.deleteMany();
});