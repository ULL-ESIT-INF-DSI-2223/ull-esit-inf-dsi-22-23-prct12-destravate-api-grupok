import { Document, Schema, model } from "mongoose";
import { Activity } from "../enums/activityEnum.js";
import { TrackDocumentInterface } from "./track.js";
import { UserDocumentInterface } from "./user.js";

/**
 * Interfaz que define el formato de un challenge, se usa en mongoose
 */
export interface ChallengeDocumentInterface extends Document {
  name: string;
  tracks: TrackDocumentInterface[];
  activity: Activity;
  length: number;
  users: UserDocumentInterface[];
}

/**
 * Esquema de mongoose para challenge, utilizado para crear el modelo de mongoose
 */
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
      validator: function (val: number) {
        return val > 0;
      },
      message: (props) => `Invalid length: ${props.value}`,
    },
  },
  users: {
    type: [Schema.Types.ObjectId],
    required: false,
    ref: "User",
  },
  tracks: {
    type: [Schema.Types.ObjectId],
    required: false,
    ref: "Track",
  },
  activity: {
    type: String,
    enum: Object.values(Activity),
    required: true,
  },
});

/**
 * Modelo de mongoose para challenge, exportado pues se usa en la implementación de los routers
 */
export const Challenge = model<ChallengeDocumentInterface>(
  "Challenge",
  challengeSchema
);
