import { Document, Schema, model } from 'mongoose';
import { Activity } from '../enums/activityEnum.js';
import { Coordinates } from '../interfaces/coordinatesInterface.js';

export interface TrackInterface extends Document {
  ID: number;
  name: string;
  startCoordinates: Coordinates; // [lat, long]
  endCoordinates: Coordinates; // [lat, long]
  length: number;
  grade: number;
  users: number[];
  activities: Activity;
  rating: number;
}

const trackSchema = new Schema<TrackInterface>({
  ID: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  startCoordinates: {
    type: Object,
    validate: {
      validator: function(val: Coordinates) {
        return typeof val.lat === "number" && typeof val.long === "number";
      },
      message: props => `Invalid start coordinates: ${JSON.stringify(props.value)}`
    },
    required: true,
  },
  endCoordinates: {
    type: Object,
    validate: {
      validator: function(val: Coordinates) {
        return typeof val.lat === "number" && typeof val.long === "number";
      },
      message: props => `Invalid end coordinates: ${JSON.stringify(props.value)}`
    },
    required: true,
  },
  length: {
    type: Number,
    required: true,
  },
  grade: {
    type: Number,
    required: true,
  },
  users: {
    type: [Number],
    required: false,
  },
  activities: {
    type : String, 
    enum : Object.values(Activity),
    required: true,
  },
  rating: {
    type: Number,
    required: false,
  },
});

export const Track = model<TrackInterface>('Track', trackSchema);