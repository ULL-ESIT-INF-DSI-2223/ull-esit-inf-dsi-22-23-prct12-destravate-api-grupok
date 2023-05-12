import { Document, Schema, model } from 'mongoose';
import { TrainingStatisticsInterface } from '../interfaces/trainingStatistics.js';
import { UserDocumentInterface } from './user.js';
import { TrackDocumentInterface } from './track.js';
import { HistoryData } from '../interfaces/historyInterface.js';

export interface GroupDocumentInterface extends Document {
  name: string;
  members: UserDocumentInterface[];
  groupStatistics: TrainingStatisticsInterface;
  userClasification: number[]; // usuarios ordenados por cantidad de km más el desnivel
  favouriteTracks: TrackDocumentInterface[]; // ordenado de mayor a menor en función del número de veces que se ha hecho la ruta
  tracksHistory: HistoryData[];
}

const groupSchema = new Schema<GroupDocumentInterface>({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  members: {
    type: [Schema.Types.ObjectId],
    default: [],
    ref: 'User',
  },
  groupStatistics: {
    type: Object,
    validate: {
      validator: function(val: TrainingStatisticsInterface) {
        const isWeekValid = val.week && typeof val.week.km === "number" && typeof val.week.elevationGain === "number";
        const isMonthValid = val.month && typeof val.month.km === "number" && typeof val.month.elevationGain === "number";
        const isYearValid = val.year && typeof val.year.km === "number" && typeof val.year.elevationGain === "number";
        return isWeekValid && isMonthValid && isYearValid;
      }
    },
    required: false,
  },
  userClasification: {
    type: [Number],
    default: [],
  },
  favouriteTracks: {
    type: [Schema.Types.ObjectId],
    default: [],
    ref: 'Track',
  },
  tracksHistory: {
    type: [Object],
    default: [],
  },
});

export const Group = model<GroupDocumentInterface>('Group', groupSchema);