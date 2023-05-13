import { expect } from "chai";
import request from "supertest";
import { app } from "../../src/app.js";
import { Challenge } from "../../src/models/challenge.js";
import { Group } from "../../src/models/group.js";
import { Track } from "../../src/models/track.js";
import { User } from "../../src/models/user.js";

const user1 = {
  name: "Aday",
  activity: "running",
  friends: [] as string[],
  groups: [] as string[],
  trainingStatistics: {
    week: { km: 10, elevationGain: 100 },
    month: { km: 20, elevationGain: 200 },
    year: { km: 50, elevationGain: 500 },
  },
  favouriteTracks: [] as string[],
  tracksHistory: [] as string[],
  activeChallenges: [] as string[],
};

const user2 = {
  name: "Yanfri",
  activity: "cycling",
  friends: [] as string[],
  groups: [] as string[],
  trainingStatistics: {
    week: { km: 30, elevationGain: 101 },
    month: { km: 220, elevationGain: 210 },
    year: { km: 51, elevationGain: 444 },
  },
  favouriteTracks: [] as string[],
  tracksHistory: [] as string[],
  activeChallenges: [] as string[],
};

const group1 = {
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
  members: [] as string[],
  favouriteTracks: [] as string[],
  tracksHistory: [] as string[],
};

const group2 = {
  name: "GrupoYanfri",
  groupStatistics: {
    week: {
      km: 3,
      elevationGain: 1,
    },
    month: {
      km: 3,
      elevationGain: 244,
    },
    year: {
      km: 1,
      elevationGain: 42,
    },
  },
  members: [] as string[],
  favouriteTracks: [] as string[],
  tracksHistory: [] as string[],
};

const challenge1 = {
  name: "AdayChallenge",
  tracks: [] as string[],
  activity: "running",
  length: 45,
  users: [] as string[],
};

const challenge2 = {
  name: "YanfriChallenge",
  tracks: [] as string[],
  activity: "cycling",
  length: 45,
  users: [] as string[],
};

const track1 = {
  name: "Tritonman",
  startCoordinates: [12, 12],
  endCoordinates: [23, 25],
  length: 44,
  grade: 6,
  users: [] as string[],
  activity: "running",
  rating: 4.3,
};

const track2 = {
  name: "Chico percebe",
  startCoordinates: [12, 12],
  endCoordinates: [23, 25],
  length: 44,
  grade: 6,
  users: [] as string[],
  activity: "running",
  rating: 4.3,
};
