import { Document, Schema, model } from 'mongoose';
import { TrainingStatisticsInterface } from '../interfaces/trainingStatistics.js';

export interface GroupDocumentInterface extends Document {
  ID: number;
  name: string;
  members: number[];
  groupStatistics: TrainingStatisticsInterface;
  userClasification: number[]; // usuarios ordenados por cantidad de km más el desnivel
  favouriteTracks: number[]; // ordenado de mayor a menor en función del número de veces que se ha hecho la ruta
  tracksHistory: [number, string][];
}

const groupSchema = new Schema<GroupDocumentInterface>({
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
  members: {
    type: [Number],
    required: true,
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
    required: true,
  },
  favouriteTracks: {
    type: [Number],
    required: true,
  },
  tracksHistory: {
    type: [[Number, String]],
    required: true,
  },
});

export const Group = model<GroupDocumentInterface>('Group', groupSchema);