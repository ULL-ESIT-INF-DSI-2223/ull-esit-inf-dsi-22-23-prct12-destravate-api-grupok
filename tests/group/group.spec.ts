import { expect } from "chai";
import request from "supertest";
import { app } from "../../src/app.js";
import { Group } from "../../src/models/group.js";
import { User } from "../../src/models/user.js";
const firstUser = {
  name: "Yanfri",
  activity: "running",
  trainingStatistics: {
    week: { km: 10, elevationGain: 100 },
    month: { km: 0, elevationGain: 0 },
    year: { km: 0, elevationGain: 0 },
  },
};

const userToAdd = {
  name: "Aday",
  activity: "running",
  trainingStatistics: {
    week: { km: 2, elevationGain: 1300 },
    month: { km: 4, elevationGain: 6 },
    year: { km: 6, elevationGain: 6 },
  },
};
const firstGroup = {
  name: "GrupoAday",
  groupStatistics: {
    week: {
      km: 10,
      elevationGain: 100,
    },
    month: {
      km: 20,
      elevationGain: 200,
    },
    year: {
      km: 50,
      elevationGain: 500,
    },
  },
};

const groupToAdd = {
  name: "GrupoYanfri",
  groupStatistics: {
    week: {
      km: 1,
      elevationGain: 43,
    },
    month: {
      km: 2350,
      elevationGain: 54,
    },
    year: {
      km: 51,
      elevationGain: 5123,
    },
  },
};

beforeEach(async () => {
  await Group.deleteMany();
  await new Group(firstGroup).save();
});

describe("POST /groups", () => {
  it("Should successfully create a new group", async () => {
    const response = await request(app)
      .post("/groups")
      .send(groupToAdd)
      .expect(201);
    expect(response.body).to.include({
      name: "GrupoYanfri",
    });

    expect(response.body.groupStatistics).to.eql({
      week: {
        km: 1,
        elevationGain: 43,
      },
      month: {
        km: 2350,
        elevationGain: 54,
      },
      year: {
        km: 51,
        elevationGain: 5123,
      },
    });

    const secondGroup = await Group.findById(response.body._id);
    expect(secondGroup).not.to.be.null;
    expect(secondGroup?.name).to.equal("GrupoYanfri");
  });

  it("Should get an error if try to insert a group that is already in DB", async () => {
    await request(app).post("/groups").send(firstGroup).expect(400);
  });
});

describe("GET /groups", () => {
  it("Should get a group by groupname", async () => {
    const response = await request(app)
      .get("/groups?name=GrupoAday")
      .expect(200);
    expect(response.body[0]).to.include({
      name: "GrupoAday",
    });

    expect(response.body[0].groupStatistics).to.eql({
      week: {
        km: 10,
        elevationGain: 100,
      },
      month: {
        km: 20,
        elevationGain: 200,
      },
      year: {
        km: 50,
        elevationGain: 500,
      },
    });
  });

  it("Should not find a group by groupname", async () => {
    await request(app).get("/groups?name=NoSoygroupDeLaBDD").expect(404);
  });
});

describe("GET /groups/:id", () => {
  it("Should get a group by id", async () => {
    const awaitGroup = await request(app)
      .post("/groups")
      .send(groupToAdd)
      .expect(201);
    const response = await request(app)
      .get(`/groups/${awaitGroup.body._id}`)
      .expect(200);
    expect(response.body).to.include({
      name: "GrupoYanfri",
    });

    expect(response.body.groupStatistics).to.eql({
      week: {
        km: 1,
        elevationGain: 43,
      },
      month: {
        km: 2350,
        elevationGain: 54,
      },
      year: {
        km: 51,
        elevationGain: 5123,
      },
    });
  });

  it("Should not get a group by id if the id does not exist", async () => {
    await request(app).get(`/groups/ab5d342cf4d742296183ddb0`).expect(404);
  });

  it("Should not get a group by id if is not valid", async () => {
    await request(app).get(`/groups/idquenoexiste`).expect(500);
  });
});

describe("PATCH /groups", () => {
  it("Should update a group by query", async () => {
    const response = await request(app)
      .patch(`/groups?name=GrupoAday`)
      .send({
        name: "GrupoCambiado",
      })
      .expect(200);
    expect(response.body).to.include({
      name: "GrupoCambiado",
    });

    const secondGroup = await Group.findById(response.body._id);
    expect(secondGroup).not.to.be.null;
    expect(secondGroup?.name).to.equal("GrupoCambiado");
  });

  it("Should not update a group by query if does not exist", async () => {
    await request(app)
      .patch(`/groups?name=NoSoyRutaDeLaBDD`)
      .send({
        name: "GrupoCambiado",
      })
      .expect(404);
  });

  it ("Should not update a group by query if is not valid", async () => {
    await request(app)
      .patch(`/groups?name=GrupoAday`)
      .send({
        falafel: "GrupoCambiado",
      })
      .expect(400);
  });

  it("Should update members field ", async () => {
    /// Creamos un usuario
    const response = await request(app).post("/users").send(userToAdd).expect(201);
    /// Creamos un grupo
    const response2 = await request(app).post("/groups").send(groupToAdd).expect(201);
    /// Añadimos el usuario al grupo
    const response3 = await request(app).patch(`/groups?name=GrupoYanfri`).send({
      members: [response.body._id]
    }).expect(200);
    /// Comprobamos que el usuario está en el grupo
    expect(response3.body.members).to.include(response.body._id);
    /// Borramos el usuario
    await request(app).delete(`/users/${response.body._id}`).expect(200);
    /// Comprobamos que el usuario ya no está en el grupo
    const response4 = await request(app).get(`/groups/${response2.body._id}`).expect(200);
    expect(response4.body.members).not.to.include(response.body._id);
  });
});

describe("PATCH /groups/:id", () => {
  it("Should update a group by id", async () => {
    const awaitGroup = await request(app)
      .post("/groups")
      .send(groupToAdd)
      .expect(201);
    const response = await request(app)
      .patch(`/groups/${awaitGroup.body._id}`)
      .send({
        name: "GrupoCambiado",
      })
      .expect(200);
    expect(response.body).to.include({
      name: "GrupoCambiado",
    });

    const secondGroup = await Group.findById(response.body._id);
    expect(secondGroup).not.to.be.null;
    expect(secondGroup?.name).to.equal("GrupoCambiado");
  });

  it("Should not update a group by id if the id does not exist", async () => {
    await request(app)
      .patch(`/groups/ab5d342cf4d742296183d123`)
      .send({
        name: "GrupoCambiado",
      })
      .expect(404);
  });

  it("Should not update a group by id if is not valid", async () => {
    await request(app)
      .patch(`/groups/idquenoexiste`)
      .send({
        name: "GrupoCambiado",
      })
      .expect(400);
  });
});

describe("DELETE /groups", () => {
  it("Should delete a group by query", async () => {
    const response = await request(app)
      .delete(`/groups?name=GrupoAday`)
      .expect(200);
    expect(response.body).to.include({
      name: "GrupoAday",
    });
    const secondGroup = await Group.findById(response.body._id);
    expect(secondGroup).to.be.null;
  });

  it("Should not delete a group by query if the group does not exist", async () => {
    await request(app).delete(`/groups?name=NoSoRutaDeLaBDD`).expect(404);
  });
});

describe("DELETE /groups/:id", () => {
  it("Should delete a group by id", async () => {
    const awaitGroup = await request(app)
      .post("/groups")
      .send(groupToAdd)
      .expect(201);
    const response = await request(app)
      .delete(`/groups/${awaitGroup.body._id}`)
      .expect(200);
    expect(response.body).to.include({
      name: "GrupoYanfri",
    });
  });

  it("Should not delete a group by id if the id does not exist", async () => {
    await request(app).delete(`/groups/ab5d342cf4d742296183d123`).expect(404);
  });

  it("Should not delete a group by id if is not valid", async () => {
    await request(app).delete(`/groups/idquenoexiste`).expect(500);
  });
});

afterEach(async () => {
  await Group.deleteMany();
});
