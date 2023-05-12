// import { expect } from 'chai';
// import request from 'supertest';
// import { app } from '../../src/app.js';
// import { Group } from '../../src/models/group.js';

// const firstGroup = {
//   name: "Ironman",
//   startCoordinates: [12,12],
//   endCoordinates: [23,25],
//   length: 44,
//   grade: 6,
//   activity: "running",
//   rating: 4.3
// }

// const groupToAdd = {
//   name: "Decathlon",
//   startCoordinates: [10,10],
//   endCoordinates: [22,30],
//   length: 60,
//   grade: 8,
//   activity: "running",
//   rating: 5
// }

// beforeEach(async () => {
//   await Group.deleteMany();
//   await new Group(firstGroup).save();
// });

// describe('POST /groups', () => {
//   it('Should successfully create a new group', async () => {
//     const response = await request(app).post('/groups').send(groupToAdd).expect(201);
//     expect(response.body).to.include({
//       name: "Decathlon",
//       length: 60,
//       grade: 8,
//       activity: "running",
//       rating: 5
//     });
//     expect (response.body.startCoordinates).to.eql([10,10]);
//     expect (response.body.endCoordinates).to.eql([22,30]);
 
//     const secondGroup = await Group.findById(response.body._id);
//     expect(secondGroup).not.to.be.null;
//     expect(secondGroup?.name).to.equal('Decathlon');
//   });

//   it('Should get an error if try to insert a group that is already in DB', async () => {
//     await request(app).post('/groups').send(firstGroup).expect(400);
//   });
// });


// describe('GET /groups', () => {
//   it('Should get a group by groupname', async () => {
//     const response = await request(app).get('/groups?name=Ironman').expect(200);
//     expect(response.body[0]).to.include({
//       name: "Ironman",
//       length: 44,
//       grade: 6,
//       activity: "running",
//       rating: 4.3
//     });
//     expect (response.body[0].startCoordinates).to.eql([12,12]);
//     expect (response.body[0].endCoordinates).to.eql([23,25]);

//   });

//   it('Should not find a group by groupname', async () => {
//     await request(app).get('/groups?name=NoSoygroupDeLaBDD').expect(404);
//   });
// });


// describe('GET /groups/:id', () => {
//   it('Should get a group by id', async () => {
//     const awaitgroup = await request(app).post('/groups').send(groupToAdd).expect(201);
//     const response = await request(app).get(`/groups/${awaitgroup.body._id}`).expect(200);
//     expect(response.body).to.include({
//       name: "Decathlon",
//       length: 60,
//       grade: 8,
//       activity: "running",
//       rating: 5
//     });
//     expect (response.body.startCoordinates).to.eql([10,10]);
//     expect (response.body.endCoordinates).to.eql([22,30]);
//   });
  
//   it ('Should not get a group by id if the id does not exist', async () => {
//     await request(app).get(`/groups/ab5d342cf4d742296183ddb0`).expect(404);
//   });

//   it ('Should not get a group by id if is not valid', async () => {
//     await request(app).get(`/groups/idquenoexiste`).expect(500);
//   });

// });


// describe('PATCH /groups', () => {
//   it('Should update a group by query', async () => {
//     const response = await request(app).patch(`/groups?name=Ironman`).send({
//                       activity : "cycling",
//                     }).expect(200);
//     expect(response.body).to.include({
//       name: "Ironman",
//       length: 44,
//       grade: 6,
//       activity: "cycling",
//       rating: 4.3
//     });
//     expect (response.body.startCoordinates).to.eql([12,12]);
//     expect (response.body.endCoordinates).to.eql([23,25]);
 
//     const secondGroup = await Group.findById(response.body._id);
//     expect(secondGroup).not.to.be.null;
//     expect(secondGroup?.activity).to.equal('cycling');
//   });

//   it ('Should not update a group by query if does not exist', async () => {
//     await request(app).patch(`/groups?name=NoSoyRutaDeLaBDD`).send({
//                       activity : "cycling",
//                     }).expect(400);
//   });
// });


// describe('PATCH /groups/:id', () => {
//   it('Should update a group by id', async () => {
//     const awaitgroup = await request(app).post('/groups').send(groupToAdd).expect(201);
//     const response = await request(app).patch(`/groups/${awaitgroup.body._id}`).send({
//                       activity : "cycling",
//                     }).expect(200);
//     expect(response.body).to.include({
//       name: "Decathlon",
//       length: 60,
//       grade: 8,
//       activity: "cycling",
//       rating: 5
//     });
//     expect (response.body.startCoordinates).to.eql([10,10]);
//     expect (response.body.endCoordinates).to.eql([22,30]);
 
//     const secondGroup = await Group.findById(response.body._id);
//     expect(secondGroup).not.to.be.null;
//     expect(secondGroup?.activity).to.equal('cycling');
//   });

//   it ('Should not update a group by id if the id does not exist', async () => {
//     await request(app).patch(`/groups/ab5d342cf4d742296183d123`).send({
//                       activity : "cycling",
//                     }).expect(404);
//   });

//   it ('Should not update a group by id if is not valid', async () => {
//     await request(app).patch(`/groups/idquenoexiste`).send({
//                       activity : "cycling",
//                     }).expect(400);
//   });
// });


// describe('DELETE /groups', () => {
//   it('Should delete a group by query', async () => {
//     const response = await request(app).delete(`/groups?name=Ironman`).expect(200);
//     expect(response.body).to.include({
//       name: "Ironman",
//       length: 44,
//       grade: 6,
//       activity: "running",
//       rating: 4.3
//     });
//     const secondGroup = await Group.findById(response.body._id);
//     expect(secondGroup).to.be.null;
//   });

//   it ('Should not delete a group by query if the group does not exist', async () => {
//     await request(app).delete(`/groups?name=NoSoRutaDeLaBDD`).expect(404);
//   });
// });

// describe('DELETE /groups/:id', () => {
//   it('Should delete a group by id', async () => {
//     const awaitgroup = await request(app).post('/groups').send(groupToAdd).expect(201);
//     const response = await request(app).delete(`/groups/${awaitgroup.body._id}`).expect(200);
//     expect(response.body).to.include({
//       name: "Decathlon",
//       length: 60,
//       grade: 8,
//       activity: "running",
//       rating: 5
//     });
//   });

//   it ('Should not delete a group by id if the id does not exist', async () => {
//     await request(app).delete(`/groups/ab5d342cf4d742296183d123`).expect(404);
//   });

//   it ('Should not delete a group by id if is not valid', async () => {
//     await request(app).delete(`/groups/idquenoexiste`).expect(500);
//   });
// });
  
// after(async () => {
//   await Group.deleteMany();
// });