import { Document, Schema, model } from 'mongoose';
import { Activity } from '../enums/activityEnum.js';
import { UserDocumentInterface } from './user.js';

/**
 * Interfaz que define el formato de un track, se usa en mongoose
 */
export interface TrackDocumentInterface extends Document {
  name: string;
  startCoordinates: [number, number]; // [lat, long]
  endCoordinates: [number, number]; // [lat, long]
  length: number;
  grade: number;
  users: [UserDocumentInterface];
  activity: Activity;
  rating: number;
}

/**
 * Esquema de mongoose para track, utilizado para crear el modelo de mongoose
 */
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
    type: [Schema.Types.ObjectId],
    default: [],
    ref: 'User',
  },
  activity: {
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

/**
 * Modelo de mongoose para track, exportado pues se usa en la implementación de los routers
 */
export const Track = model<TrackDocumentInterface>('Track', trackSchema);