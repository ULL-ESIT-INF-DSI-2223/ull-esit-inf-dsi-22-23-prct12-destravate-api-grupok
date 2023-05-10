import { Document, Schema, model } from 'mongoose';
import { Activity } from '../enums/activityEnum.js';
import { UserDocumentInterface } from './user.js';

export interface TrackDocumentInterface extends Document {
  name: string;
  startCoordinates: [number, number]; // [lat, long]
  endCoordinates: [number, number]; // [lat, long]
  length: number;
  grade: number;
  users: UserDocumentInterface[];
  activities: Activity;
  rating: number;
}

const trackSchema = new Schema<TrackDocumentInterface>({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  startCoordinates: {
    type: [Number, Number],
    required: true,
  },
  endCoordinates: {
    type: [Number, Number],
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
    type: [[Schema.Types.ObjectId, String]],
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

export const Track = model<TrackDocumentInterface>('Track', trackSchema);