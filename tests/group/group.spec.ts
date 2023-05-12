import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../src/app.js';
import { Group } from '../../src/models/group.js';

const firstGroup = {
   name: "GrupoAday",
   groupStatistics: {
      week: {
        km: 10,
        elevationGain: 100
      },
      month: {
        km: 20,
        elevationGain: 200
      },
      year: {
        km: 50,
        elevationGain: 500
      }
    },
 }

const groupToAdd = {
  name: "GrupoYanfri",
   groupStatistics: {
      week: {
        km: 1,
        elevationGain: 43
      },
      month: {
        km: 2350,
        elevationGain: 54
      },
      year: {
        km: 51,
        elevationGain: 5123
      }
    },
}

beforeEach(async () => {
  await Group.deleteMany();
  await new Group(firstGroup).save();
});

describe('POST /groups', () => {
  it('Should successfully create a new group', async () => {
    const response = await request(app).post('/groups').send(groupToAdd).expect(201);
    expect(response.body).to.include({
      name: "GrupoAday",
    });

    expect(response.body.groupStatistics).to.eql({
      week: {
        km: 10,
        elevationGain: 100
      },
      month: {
        km: 20,
        elevationGain: 200
      },
      year: {
        km: 50,
        elevationGain: 500
      }
    });
    

    const secondgroup = await Group.findById(response.body._id);
    expect(secondgroup).not.to.be.null;
    expect(secondgroup?.name).to.equal('GrupoAday');
  });

  it('Should get an error if try to insert a group that is already in DB', async () => {
    await request(app).post('/groups').send(firstGroup).expect(400);
  });
});


describe('GET /groups', () => {
  it('Should get a group by groupname', async () => {
    const response = await request(app).get('/groups?name=Ironman').expect(200);
    expect(response.body[0]).to.include({
      name: "Ironman",
      activity: "running",
      length: 45,
    });
  });

  it('Should not find a group by groupname', async () => {
    await request(app).get('/groups?name=NoSoygroupDeLaBDD').expect(404);
  });
});


describe('GET /groups/:id', () => {
  it('Should get a group by id', async () => {
    const awaitgroup = await request(app).post('/groups').send(groupToAdd).expect(201);
    const response = await request(app).get(`/groups/${awaitgroup.body._id}`).expect(200);
    expect(response.body).to.include({
      name: "Decathlon",
      activity: "running",
      length: 45,
    });
  });
  
  it ('Should not get a group by id if the id does not exist', async () => {
    await request(app).get(`/groups/ab5d342cf4d742296183ddb0`).expect(404);
  });

  it ('Should not get a group by id if is not valid', async () => {
    await request(app).get(`/groups/idquenoexiste`).expect(500);
  });

});


// describe('PATCH /groups', () => {
//   it('Should update a group by query', async () => {
//     const response = await request(app).patch(`/groups?name=Ironman`).send({
//                       activity : "cycling",
//                     }).expect(200);
//     expect(response.body).to.include({
//       name: "Ironman",
//       activity: "cycling",
//       length: 45,
//     });

//     const secondgroup = await Group.findById(response.body._id);
//     expect(secondgroup).not.to.be.null;
//     expect(secondgroup?.activity).to.equal('cycling');
//   });

//   it ('Should not update a group by query if does not exist', async () => {
//     await request(app).patch(`/groups?name=NoSoyRutaDeLaBDD`).send({
//                       activity : "cycling",
//                     }).expect(404);
//   });
// });


// describe('PATCH /groups/:id', () => {
//   it('Should update a group by id', async () => {
//     const awaitgroup = await request(app).post('/groups').send(groupToAdd).expect(201);
//     const response = await request(app).patch(`/groups/${awaitgroup.body._id}`).send({
//                       activity: "cycling",
//                     }).expect(200);
//     expect(response.body).to.include({
//       name: "Decathlon",
//       activity: "cycling",
//       length: 45,
//     });
 
//     const secondgroup = await Group.findById(response.body._id);
//     expect(secondgroup).not.to.be.null;
//     expect(secondgroup?.activity).to.equal('cycling');
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


describe('DELETE /groups', () => {
  it('Should delete a group by query', async () => {
    const response = await request(app).delete(`/groups?name=Ironman`).expect(200);
    expect(response.body).to.include({
      name: "Ironman",
      activity: "running",
      length: 45,
    });
    const secondgroup = await Group.findById(response.body._id);
    expect(secondgroup).to.be.null;
  });

  it ('Should not delete a group by query if the group does not exist', async () => {
    await request(app).delete(`/groups?name=NoSoRutaDeLaBDD`).expect(404);
  });
});

describe('DELETE /groups/:id', () => {
  it('Should delete a group by id', async () => {
    const awaitgroup = await request(app).post('/groups').send(groupToAdd).expect(201);
    const response = await request(app).delete(`/groups/${awaitgroup.body._id}`).expect(200);
    expect(response.body).to.include({
      name: "Decathlon",
      activity: "running",
      length: 45,
    });
  });

  it ('Should not delete a group by id if the id does not exist', async () => {
    await request(app).delete(`/groups/ab5d342cf4d742296183d123`).expect(404);
  });

  it ('Should not delete a group by id if is not valid', async () => {
    await request(app).delete(`/groups/idquenoexiste`).expect(500);
  });
});
  
after(async () => {
  await Group.deleteMany();
});