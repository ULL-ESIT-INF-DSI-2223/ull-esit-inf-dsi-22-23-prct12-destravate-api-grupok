import { expect } from "chai";
import request from "supertest";
import { app } from "../../src/app.js";
import { Challenge } from "../../src/models/challenge.js";
import { User } from "../../src/models/user.js";
import { afterEach } from "mocha";
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
const firstChallenge = {
  name: "Ironman",
  activity: "running",
  length: 45,
};

const challengeToAdd = {
  name: "Decathlon",
  activity: "running",
  length: 45,
};

beforeEach(async () => {
  await Challenge.deleteMany();
  await new Challenge(firstChallenge).save();
});

describe("POST /challenges", () => {
  it("Should successfully create a new challenge", async () => {
    const response = await request(app)
      .post("/challenges")
      .send(challengeToAdd)
      .expect(201);
    expect(response.body).to.include({
      name: "Decathlon",
      activity: "running",
      length: 45,
    });

    const secondChallenge = await Challenge.findById(response.body._id);
    expect(secondChallenge).not.to.be.null;
    expect(secondChallenge?.name).to.equal("Decathlon");
  });

  it("Should get an error if try to insert a challenge that is already in DB", async () => {
    await request(app).post("/challenges").send(firstChallenge).expect(400);
  });

});

describe("GET /challenges", () => {
  it("Should get a challenge by challengename", async () => {
    const response = await request(app)
      .get("/challenges?name=Ironman")
      .expect(200);
    expect(response.body[0]).to.include({
      name: "Ironman",
      activity: "running",
      length: 45,
    });
  });

  it("Should not find a challenge by challengename", async () => {
    await request(app)
      .get("/challenges?name=NoSoychallengeDeLaBDD")
      .expect(404);
  });
});

describe("GET /challenges/:id", () => {
  it("Should get a challenge by id", async () => {
    const awaitchallenge = await request(app)
      .post("/challenges")
      .send(challengeToAdd)
      .expect(201);
    const response = await request(app)
      .get(`/challenges/${awaitchallenge.body._id}`)
      .expect(200);
    expect(response.body).to.include({
      name: "Decathlon",
      activity: "running",
      length: 45,
    });
  });

  it("Should not get a challenge by id if the id does not exist", async () => {
    await request(app).get(`/challenges/ab5d342cf4d742296183ddb0`).expect(404);
  });

  it("Should not get a challenge by id if is not valid", async () => {
    await request(app).get(`/challenges/idquenoexiste`).expect(500);
  });
});

describe("PATCH /challenges", () => {
  it("Should update a challenge by query", async () => {
    const response = await request(app)
      .patch(`/challenges?name=Ironman`)
      .send({
        activity: "cycling",
      })
      .expect(200);
    expect(response.body).to.include({
      name: "Ironman",
      activity: "cycling",
      length: 45,
    });

    const secondChallenge = await Challenge.findById(response.body._id);
    expect(secondChallenge).not.to.be.null;
    expect(secondChallenge?.activity).to.equal("cycling");
  });

  it("Should not update a challenge by query if does not exist", async () => {
    await request(app)
      .patch(`/challenges?name=NoSoyRutaDeLaBDD`)
      .send({
        activity: "cycling",
      })
      .expect(404);
  });

  it("Should not update a challenge by query if is not valid", async () => {
    await request(app)
    .patch(`/challenges?name=Ironman`)
    .send({
      flaka: "jaka",
    })
    .expect(400);
  });
 
  it ("Should update a challenge users field by query", async () => {
    // /// Insertamos un usuario
    // const awaitUser = await request(app).post("/users").send(userToAdd).expect(201);
    // /// Insertamos un challenge
    // const awaitchallenge = await request(app).post("/challenges").send(challengeToAdd).expect(201);
    // /// Añadimos el challenge al usuario
    // await request(app).patch(`/user?name=Aday`).send({
    //   activeChallenges: [awaitchallenge.body._id],
    // });
    // /// Ahora borramos el challenge
    // await request(app).delete(`/challenges?name=Decathlon`).expect(200);
    // /// Comprobamos que el usuario ya no tiene el challenge
    // /// Hacemos un get del usuario y comprobamos que el campo activeChallenges está vacío
    // const response = await request(app).get(`/users/${awaitUser.body._id}`).expect(200);
    // expect(response.body.activeChallenges).to.be.eql([]);

    // Insertamos un usuario
    const awaitUser = await request(app).post("/users").send(userToAdd).expect(201);
    // Insertamos un challenge
    const awaitchallenge = await request(app).post("/challenges").send(challengeToAdd).expect(201);
    // Añadimos el usuario al challenge
    await request(app).patch(`/challenges?name=Decathlon`).send({
      users: [awaitUser.body._id],
    }).expect(200);
    // Ahora borramos el usuario
    await request(app).delete(`/users?name=Aday`).expect(200);
    // Comprobamos que el challenge ya no tiene el usuario
    // Hacemos un get del challenge y comprobamos que el campo users está vacío
    const response = await request(app).get(`/challenges/${awaitchallenge.body._id}`).expect(200);
    expect(response.body.users).to.be.eql([]);
  });
});

describe("PATCH /challenges/:id", () => {
  it("Should update a challenge by id", async () => {
    const awaitchallenge = await request(app)
      .post("/challenges")
      .send(challengeToAdd)
      .expect(201);
    const response = await request(app)
      .patch(`/challenges/${awaitchallenge.body._id}`)
      .send({
        activity: "cycling",
      })
      .expect(200);
    expect(response.body).to.include({
      name: "Decathlon",
      activity: "cycling",
      length: 45,
    });

    const secondChallenge = await Challenge.findById(response.body._id);
    expect(secondChallenge).not.to.be.null;
    expect(secondChallenge?.activity).to.equal("cycling");
  });

  it("Should not update a challenge by id if the id does not exist", async () => {
    await request(app)
      .patch(`/challenges/ab5d342cf4d742296183d123`)
      .send({
        activity: "cycling",
      })
      .expect(404);
  });

  it("Should not update a challenge by id if is not valid", async () => {
    await request(app)
      .patch(`/challenges/idquenoexiste`)
      .send({
        activity: "cycling",
      })
      .expect(400);
  });

  it ("Should not update a challenge by id if the field is not valid", async () => {
    await request(app)
      .patch(`/challenges/idquenoexiste`)
      .send({
        flaka: "jaka",
      })
      .expect(400);
  });
  
  it ("Should update a challenge users field by query", async () => {
    // Insertamos un usuario
    const awaitUser = await request(app).post("/users").send(userToAdd).expect(201);
    // Insertamos un challenge
    const awaitchallenge = await request(app).post("/challenges").send(challengeToAdd).expect(201);
    // Añadimos el usuario al challenge
    await request(app).patch(`/challenges/${awaitchallenge.body._id}`).send({
      users: [awaitUser.body._id],
    }).expect(200);
    // Ahora borramos el usuario
    await request(app).delete(`/users/${awaitUser.body._id}`).expect(200);
    // Comprobamos que el challenge ya no tiene el usuario
    // Hacemos un get del challenge y comprobamos que el campo users está vacío
    const response = await request(app).get(`/challenges/${awaitchallenge.body._id}`).expect(200);
    expect(response.body.users).to.be.eql([]);
  });
});

describe("DELETE /challenges", () => {
  it("Should delete a challenge by query", async () => {
    const response = await request(app)
      .delete(`/challenges?name=Ironman`)
      .expect(200);
    expect(response.body).to.include({
      name: "Ironman",
      activity: "running",
      length: 45,
    });
    const secondChallenge = await Challenge.findById(response.body._id);
    expect(secondChallenge).to.be.null;
  });

  it("Should not delete a challenge by query if the challenge does not exist", async () => {
    await request(app).delete(`/challenges?name=NoSoRutaDeLaBDD`).expect(404);
  });
});

describe("DELETE /challenges/:id", () => {
  it("Should delete a challenge by id", async () => {
    const awaitchallenge = await request(app)
      .post("/challenges")
      .send(challengeToAdd)
      .expect(201);
    const response = await request(app)
      .delete(`/challenges/${awaitchallenge.body._id}`)
      .expect(200);
    expect(response.body).to.include({
      name: "Decathlon",
      activity: "running",
      length: 45,
    });
  });

  it("Should not delete a challenge by id if the id does not exist", async () => {
    await request(app)
      .delete(`/challenges/ab5d342cf4d742296183d123`)
      .expect(404);
  });

  it("Should not delete a challenge by id if is not valid", async () => {
    await request(app).delete(`/challenges/idquenoexiste`).expect(500);
  });
});

afterEach(async () => {
  await Challenge.deleteMany();
});


