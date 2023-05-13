import { expect } from "chai";
import request from "supertest";
import { app } from "../../src/app.js";
import { User } from "../../src/models/user.js";
import { Group } from "../../src/models/group.js";
import { Challenge } from "../../src/models/challenge.js";
import { Track } from "../../src/models/track.js";

const firstChallenge = {
  name: "Ironman",
  activity: "running",
  length: 45,
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

const firstTrack = {
  name: "Ruta del pescado",
  startCoordinates: [12, 12],
  endCoordinates: [23, 25],
  length: 44,
  grade: 6,
  activity: "running",
  rating: 4.3,
};

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

beforeEach(async () => {
  await User.deleteMany();
  await new User(firstUser).save();
});

describe("POST /users", () => {
  it("Should successfully create a new user", async () => {
    const response = await request(app)
      .post("/users")
      .send(userToAdd)
      .expect(201);
    expect(response.body).to.include({
      name: "Aday",
      activity: "running",
    });

    expect(response.body.trainingStatistics).to.eql({
      week: { km: 2, elevationGain: 1300 },
      month: { km: 4, elevationGain: 6 },
      year: { km: 6, elevationGain: 6 },
    });

    const secondUser = await User.findById(response.body._id);
    expect(secondUser).not.to.be.null;
    expect(secondUser?.name).to.equal("Aday");
  });

  it("Should get an error", async () => {
    await request(app).post("/users").send(firstUser).expect(400);
  });

  it("Should get an error if the trainingStatistics are invalid", async () => {
    await request(app)
      .post("/users")
      .send({
        name: "Aday",
        activity: "running",
        trainingStatistics: {
          week: { km: "äsdasd", elevationGain: "soy una estadística mala" },
          month: { km: 4, elevationGain: 6 },
          year: { km: 6, elevationGain: 6 },
          invalid: "invalid",
        },
      })
      .expect(400);
  });

  it ("Should update the groups of the user", async () => {
    const response = await request(app)
      .post("/users")
      .send(userToAdd)
      .expect(201);
    const secondResponse = await request(app)
      .patch(`/users/${response.body._id}`)
      .send({
        groups: ["5f9d342cf4d742296183ddb0"],
      })
      .expect(200);
    expect(secondResponse.body.groups[0]).to.be.eql("5f9d342cf4d742296183ddb0");
  });
});

describe("GET /users", () => {
  it("Should get all users", async () => {
    const response = await request(app).get("/users").expect(200);
    expect(response.body.length).to.be.eql(1);
  });

  it("Should get a user by username", async () => {
    const response = await request(app).get("/users?name=Yanfri").expect(200);
    expect(response.body[0]).to.include({
      name: "Yanfri",
      activity: "running",
    });

    expect(response.body[0].trainingStatistics).to.eql({
      week: { km: 10, elevationGain: 100 },
      month: { km: 0, elevationGain: 0 },
      year: { km: 0, elevationGain: 0 },
    });
  });

  it("Should not find a user by username", async () => {
    await request(app).get("/users?name=NoSoyUsuarioDeLaBDD").expect(404);
  });

});

describe("GET /users/:id", () => {
  it("Should get a user by id", async () => {
    const awaitUser = await request(app)
      .post("/users")
      .send(userToAdd)
      .expect(201);
    const response = await request(app)
      .get(`/users/${awaitUser.body._id}`)
      .expect(200);
    expect(response.body).to.include({
      name: "Aday",
      activity: "running",
    });
  });

  it("Should not get a user by id if the id does not exist", async () => {
    await request(app).get(`/users/ab5d342cf4d742296183ddb0`).expect(404);
  });

  it("Should not get a user by id if is not valid", async () => {
    await request(app).get(`/users/idquenoexiste`).expect(500);
  });
});

describe("PATCH /users", () => {
  it("Should update a user by query", async () => {
    const response = await request(app)
      .patch(`/users?name=Yanfri`)
      .send({
        activity: "cycling",
      })
      .expect(200);
    expect(response.body).to.include({
      name: "Yanfri",
      activity: "cycling",
    });
    const secondUser = await User.findById(response.body._id);
    expect(secondUser).not.to.be.null;
    expect(secondUser?.activity).to.equal("cycling");
  });

  it("Should not update a invalid option", async () => {
    await request(app)
      .patch(`/users?name=Yanfri`)
      .send({
        _id: "ab5d342cf4d742296183d123",
      })
      .expect(400);
  });

  it("Should not update a user by query if does not exist", async () => {
    await request(app)
      .patch(`/users?name=NoSoyUsuarioDeLaBDD`)
      .send({
        activity: "cycling",
      })
      .expect(404);
  });

});

describe("PATCH /users/:id", () => {
  it("Should update a user by id", async () => {
    const awaitUser = await request(app)
      .post("/users")
      .send(userToAdd)
      .expect(201);
    const response = await request(app)
      .patch(`/users/${awaitUser.body._id}`)
      .send({
        activity: "cycling",
      })
      .expect(200);

    expect(response.body).to.include({
      name: "Aday",
      activity: "cycling",
    });
    const secondUser = await User.findById(response.body._id);
    expect(secondUser).not.to.be.null;
    expect(secondUser?.activity).to.equal("cycling");
  });

  it("Should not update a user by id if the id does not exist", async () => {
    await request(app)
      .patch(`/users/ab5d342cf4d742296183d123`)
      .send({
        activity: "cycling",
      })
      .expect(404);
  });

  it("Should not update a user by id if is not valid", async () => {
    await request(app)
      .patch(`/users/idquenoexiste`)
      .send({
        activity: "cycling",
      })
      .expect(400);
  });
});

describe("DELETE /users", () => {
  it("Should delete a user by query", async () => {
    const response = await request(app)
      .delete(`/users?name=Yanfri`)
      .expect(200);
    expect(response.body).to.include({
      name: "Yanfri",
      activity: "running",
    });
    const secondUser = await User.findById(response.body._id);
    expect(secondUser).to.be.null;
  });

  it("Should not delete a user by query if the user does not exist", async () => {
    await request(app).delete(`/users?name=NoSoyUsuarioDeLaBDD`).expect(404);
  });
});

describe("DELETE /users/:id", () => {
  it("Should delete a user by id", async () => {
    const awaitUser = await request(app)
      .post("/users")
      .send(userToAdd)
      .expect(201);
    const response = await request(app)
      .delete(`/users/${awaitUser.body._id}`)
      .expect(200);
    expect(response.body).to.include({
      name: "Aday",
      activity: "running",
    });
  });

  it("Should not delete a user by id if the id does not exist", async () => {
    await request(app).delete(`/users/ab5d342cf4d742296183d123`).expect(404);
  });

  it("Should not delete a user by id if is not valid", async () => {
    await request(app).delete(`/users/idquenoexiste`).expect(500);
  });
});

/// Comprobamos si metemos usuarios como amigos existentes
describe("FRIENDSHIP and relations", () => {
  it("Should add a friend to a user", async () => {
    const awaitUser = await request(app)
      .post("/users")
      .send(userToAdd)
      .expect(201);
    const response = await request(app)
      .patch(`/users?name=Aday`)
      .send({
        friends: [awaitUser.body._id],
      })
      .expect(200);
    expect(response.body.friends[0]).to.be.eql(awaitUser.body._id);
  });

  it("Should add tracks, challenges and groups", async () => {
    await Group.deleteMany();
    await Challenge.deleteMany();
    await Track.deleteMany();

    const challenge = await request(app)
      .post("/challenges")
      .send(firstChallenge)
      .expect(201);
    const track = await request(app)
      .post("/tracks")
      .send(firstTrack)
      .expect(201);
    const group = await request(app)
      .post("/groups")
      .send(firstGroup)
      .expect(201);
    const response1 = await request(app)
      .post("/users")
      .send(
      {
        name: "Sergio",
        activity: "running",
        trainingStatistics: {
          week: { km: 2, elevationGain: 1300 },
          month: { km: 4, elevationGain: 6 },
          year: { km: 6, elevationGain: 6 },
        },
        groups: [group.body._id],
        tracksHistory: [ 
          {
            track: track.body._id,
            date: "1987-09-28"
          }],
        activeChallenges: [challenge.body._id]
      })
      .expect(201);

      expect(response1.body.groups[0]).to.be.eql(group.body._id);

      const response2 = await request(app)
      .patch("/users?name=Sergio")
      .send(
      {
        groups: [],
        tracksHistory: [],
        activeChallenges: []
      })
      .expect(200);

      expect(response2.body.groups.length).to.be.eql(0);
    
  });
});
    
afterEach(async () => {
  await User.deleteMany();
});
