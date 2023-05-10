import { Document, Schema, model } from 'mongoose';
import { Activity } from '../enums/activityEnum.js';
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
  tracksHistory: number[];
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
    unique: false,
  },
  activities: {
    type: String,
    enum: Object.values(Activity),
    required: true,
  },    
  friends: {
    type: [Number],
    default: [],
  },
  groups: {
    type: [[Number]],
    default: [],
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
    default: [],
  },
  activeChallenges: {
    type: [Number],
    default: [],
  },
  tracksHistory: {
    type: [Number],
    default: [],
  },
});

export const User = model<UserDocumentInterface>('User', userSchema);