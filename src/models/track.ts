import { Document, Schema, model } from 'mongoose';
import { Activity } from '../enums/activityEnum.js';
import { UserDocumentInterface } from './user.js';

export interface TrackDocumentInterface extends Document {
  name: string;
  startCoordinates: [number, number]; // [lat, long]
  endCoordinates: [number, number]; // [lat, long]
  length: number;
  grade: number;
  users: [UserDocumentInterface, Date][]; // let birthday: Date = new Date(1990, 2, 15); // 15 de marzo de 1990
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
    validate: {
      validator: function(val: number) {
        return val > 0;
      },
      message: props => `Invalid length: ${props.value}`
    }
  },
  grade: {
    type: Number,
    required: true,
    validate: {
      validator: function(val: number) {
        return val >= 0;
      },
      message: props => `Invalid grade: ${props.value}`
    }
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
    validate: {
      validator: function(val: number) {
        return val >= 0 && val <= 5;
      },
      message: props => `Invalid rating: ${props.value}`
    }
  },
});

export const Track = model<TrackDocumentInterface>('Track', trackSchema);