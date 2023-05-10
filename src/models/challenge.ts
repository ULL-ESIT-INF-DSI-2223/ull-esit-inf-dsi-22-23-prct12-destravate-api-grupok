import { Document, Schema, model } from "mongoose";
import { Activity } from "../enums/activityEnum.js";

export interface ChallengeInterface extends Document {
  ID: number;
  name: string;
  tracks: number[];
  activity: Activity;
  length: number;
  users: number[];
}

const challengeSchema = new Schema<ChallengeInterface>({
  ID: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  length: {
    type: Number,
    required: true,
  },
  users: {
    type: [Number],
    required: false,
  },
  tracks: {
    type: [Number],
    required: false,
  },
  activity: {
    type: String,
    enum: Object.values(Activity),
    required: true,
  },
});

export const Challenge = model<ChallengeInterface>(
  "Challenge",
  challengeSchema
);
