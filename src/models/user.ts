import { Document, Schema, model } from 'mongoose';
import { Activity } from '../enums/activityEnum.js';
import { TrackDocumentInterface } from './track.js';
import { TrainingStatisticsInterface } from '../interfaces/trainingStatistics.js';

export interface UserDocumentInterface extends Document {
  userID: number;
  name: string;
  activities: Activity;
  friends: number[];
  groups: number[]
  trainingStatistics: TrainingStatisticsInterface;
  favouriteTracks: number[];
  activeChallenges: number[]; 
  tracksHistory: [TrackDocumentInterface, string];
}

const userSchema = new Schema<UserDocumentInterface>({
  userID: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: false,
    trim: true,
  },
  activities: {
    type: String,
    enum: Object.values(Activity),
    required: true,
  },    
  friends: {
    type: [Number],
    required: true,
  },
  groups: {
    type: [[Number]],
    required: true,
  },
  trainingStatistics: {
    type: Object,
    validate: {
      validator: function(val: TrainingStatisticsInterface) {
        const isWeekValid = val.week && typeof val.week.km === "number" && typeof val.week.elevationGain === "number";
        const isMonthValid = val.month && typeof val.month.km === "number" && typeof val.month.elevationGain === "number";
        const isYearValid = val.year && typeof val.year.km === "number" && typeof val.year.elevationGain === "number";
        return isWeekValid && isMonthValid && isYearValid;
      },
      message: props => `Invalid training statistics: ${JSON.stringify(props.value)}`
    },
    required: true,
  },  
  favouriteTracks: {
    type: [Number],
    required: true,
  },
  activeChallenges: {
    type: [Number],
    required: true,
  },
  tracksHistory: {
    type: [Schema.Types.ObjectId, String],
    required: true,
  },
});

export const User = model<UserDocumentInterface>('User', userSchema);