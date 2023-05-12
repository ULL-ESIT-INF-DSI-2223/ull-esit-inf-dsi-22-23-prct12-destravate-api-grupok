import { expect } from "chai";
import request from "supertest";
import { app } from "../../src/app.js";
import { Track } from "../../src/models/track.js";

const firstTrack = {
  name: "Ruta del pescado",
  startCoordinates: [12, 12],
  endCoordinates: [23, 25],
  length: 44,
  grade: 6,
  activity: "running",
  rating: 4.3,
};

const trackToAdd = {
  name: "Tetir",
  startCoordinates: [10, 10],
  endCoordinates: [22, 30],
  length: 60,
  grade: 8,
  activity: "running",
  rating: 5,
};

beforeEach(async () => {
  await Track.deleteMany();
  await new Track(firstTrack).save();
});

describe("POST /tracks", () => {
  it("Should successfully create a new track", async () => {
    const response = await request(app)
      .post("/tracks")
      .send(trackToAdd)
      .expect(201);
    expect(response.body).to.include({
      name: "Tetir",
      length: 60,
      grade: 8,
      activity: "running",
      rating: 5,
    });
    expect(response.body.startCoordinates).to.eql([10, 10]);
    expect(response.body.endCoordinates).to.eql([22, 30]);

    const secondTrack = await Track.findById(response.body._id);
    expect(secondTrack).not.to.be.null;
    expect(secondTrack?.name).to.equal("Tetir");
  });

  it("Should get an error if try to insert a track that is already in DB", async () => {
    await request(app).post("/tracks").send(firstTrack).expect(400);
  });
});

describe("GET /tracks", () => {
  it("Should get a track by trackname", async () => {
    const response = await request(app)
      .get("/tracks?name=Ruta del pescado")
      .expect(200);
    expect(response.body[0]).to.include({
      name: "Ruta del pescado",
      length: 44,
      grade: 6,
      activity: "running",
      rating: 4.3,
    });
    expect(response.body[0].startCoordinates).to.eql([12, 12]);
    expect(response.body[0].endCoordinates).to.eql([23, 25]);
  });

  it("Should not find a track by trackname", async () => {
    await request(app).get("/tracks?name=NoSoyTrackDeLaBDD").expect(404);
  });
});

describe("GET /tracks/:id", () => {
  it("Should get a track by id", async () => {
    const awaitTrack = await request(app)
      .post("/tracks")
      .send(trackToAdd)
      .expect(201);
    const response = await request(app)
      .get(`/tracks/${awaitTrack.body._id}`)
      .expect(200);
    expect(response.body).to.include({
      name: "Tetir",
      length: 60,
      grade: 8,
      activity: "running",
      rating: 5,
    });
    expect(response.body.startCoordinates).to.eql([10, 10]);
    expect(response.body.endCoordinates).to.eql([22, 30]);
  });

  it("Should not get a track by id if the id does not exist", async () => {
    await request(app).get(`/tracks/ab5d342cf4d742296183ddb0`).expect(404);
  });

  it("Should not get a track by id if is not valid", async () => {
    await request(app).get(`/tracks/idquenoexiste`).expect(500);
  });
});

describe("PATCH /tracks", () => {
  it("Should update a track by query", async () => {
    const response = await request(app)
      .patch(`/tracks?name=Ruta del pescado`)
      .send({
        activity: "cycling",
      })
      .expect(200);
    expect(response.body).to.include({
      name: "Ruta del pescado",
      length: 44,
      grade: 6,
      activity: "cycling",
      rating: 4.3,
    });
    expect(response.body.startCoordinates).to.eql([12, 12]);
    expect(response.body.endCoordinates).to.eql([23, 25]);

    const secondTrack = await Track.findById(response.body._id);
    expect(secondTrack).not.to.be.null;
    expect(secondTrack?.activity).to.equal("cycling");
  });

  it("Should not update a track by query if does not exist", async () => {
    await request(app)
      .patch(`/tracks?name=NoSoyRutaDeLaBDD`)
      .send({
        activity: "cycling",
      })
      .expect(404);
  });
});

describe("PATCH /tracks/:id", () => {
  it("Should update a track by id", async () => {
    const awaitTrack = await request(app)
      .post("/tracks")
      .send(trackToAdd)
      .expect(201);
    const response = await request(app)
      .patch(`/tracks/${awaitTrack.body._id}`)
      .send({
        activity: "cycling",
      })
      .expect(200);
    expect(response.body).to.include({
      name: "Tetir",
      length: 60,
      grade: 8,
      activity: "cycling",
      rating: 5,
    });
    expect(response.body.startCoordinates).to.eql([10, 10]);
    expect(response.body.endCoordinates).to.eql([22, 30]);

    const secondTrack = await Track.findById(response.body._id);
    expect(secondTrack).not.to.be.null;
    expect(secondTrack?.activity).to.equal("cycling");
  });

  it("Should not update a track by id if the id does not exist", async () => {
    await request(app)
      .patch(`/tracks/ab5d342cf4d742296183d123`)
      .send({
        activity: "cycling",
      })
      .expect(404);
  });

  it("Should not update a track by id if is not valid", async () => {
    await request(app)
      .patch(`/tracks/idquenoexiste`)
      .send({
        activity: "cycling",
      })
      .expect(400);
  });
});

describe("DELETE /tracks", () => {
  it("Should delete a track by query", async () => {
    const response = await request(app)
      .delete(`/tracks?name=Ruta del pescado`)
      .expect(200);
    expect(response.body).to.include({
      name: "Ruta del pescado",
      length: 44,
      grade: 6,
      activity: "running",
      rating: 4.3,
    });
    const secondTrack = await Track.findById(response.body._id);
    expect(secondTrack).to.be.null;
  });

  it("Should not delete a track by query if the track does not exist", async () => {
    await request(app).delete(`/tracks?name=NoSoRutaDeLaBDD`).expect(404);
  });
});

describe("DELETE /tracks/:id", () => {
  it("Should delete a track by id", async () => {
    const awaitTrack = await request(app)
      .post("/tracks")
      .send(trackToAdd)
      .expect(201);
    const response = await request(app)
      .delete(`/tracks/${awaitTrack.body._id}`)
      .expect(200);
    expect(response.body).to.include({
      name: "Tetir",
      length: 60,
      grade: 8,
      activity: "running",
      rating: 5,
    });
  });

  it("Should not delete a track by id if the id does not exist", async () => {
    await request(app).delete(`/tracks/ab5d342cf4d742296183d123`).expect(404);
  });

  it("Should not delete a track by id if is not valid", async () => {
    await request(app).delete(`/tracks/idquenoexiste`).expect(500);
  });
});

after(async () => {
  await Track.deleteMany();
});
