import { Document, Schema, model } from 'mongoose';
import { Activity } from '../enums/activityEnum.js';
import { TrackDocumentInterface } from './track.js';
import { UserDocumentInterface } from './user.js';

export interface ChallengeDocumentInterface extends Document {
  name: string;
  tracks: TrackDocumentInterface[];
  activity: Activity;
  length: number;
  users: UserDocumentInterface[];
}

const challengeSchema = new Schema<ChallengeDocumentInterface>({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
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
  users: {
    type: [Schema.Types.ObjectId],
    required: false,
  },
  tracks: {
    type: [Schema.Types.ObjectId],
    required: false,
  },
  activity: {
    type : String, 
    enum : Object.values(Activity),
    required: true,
  },

});

export const Challenge = model<ChallengeDocumentInterface>('Challenge', challengeSchema);