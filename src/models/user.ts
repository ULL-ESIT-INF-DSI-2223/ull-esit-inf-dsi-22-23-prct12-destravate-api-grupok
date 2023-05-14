import { Document, Schema, model } from "mongoose";
import { Activity } from "../enums/activityEnum.js";
import { HistoryData } from "../interfaces/historyInterface.js";
import { TrackDocumentInterface } from "./track.js";
import { TrainingStatisticsInterface } from "../interfaces/trainingStatistics.js";
import { ChallengeDocumentInterface } from "./challenge.js";
import { GroupDocumentInterface } from "./group.js";

/**
 * Interfaz que define el formato de un usuario, se usa en mongoose
 */
export interface UserDocumentInterface extends Document {
  name: string;
  activity: Activity;
  friends: UserDocumentInterface[];
  groups: GroupDocumentInterface[];
  trainingStatistics: TrainingStatisticsInterface;
  favouriteTracks: TrackDocumentInterface[];
  activeChallenges: ChallengeDocumentInterface[];
  tracksHistory: HistoryData[];
}

/**
 * Esquema de mongoose para user, utilizado para crear el modelo de mongoose
 */
const userSchema = new Schema<UserDocumentInterface>({
  name: {
    type: String,
    required: false,
    trim: true,
    unique: true,
  },
  activity: {
    type: String,
    enum: Object.values(Activity),
    required: true,
  },
  friends: {
    type: [Schema.Types.ObjectId],
    default: [],
    ref: "User",
  },
  groups: {
    type: [Schema.Types.ObjectId],
    default: [],
    ref: "Group",
  },
  trainingStatistics: {
    type: Object,
    validate: {
      validator: function (val: TrainingStatisticsInterface) {
        const isWeekValid =
          val.week &&
          typeof val.week.km === "number" &&
          typeof val.week.elevationGain === "number";
        const isMonthValid =
          val.month &&
          typeof val.month.km === "number" &&
          typeof val.month.elevationGain === "number";
        const isYearValid =
          val.year &&
          typeof val.year.km === "number" &&
          typeof val.year.elevationGain === "number";
        return isWeekValid && isMonthValid && isYearValid;
      },
      message: (props) =>
        `Invalid training statistics: ${JSON.stringify(props.value)}`,
    },
    required: true,
  },
  favouriteTracks: {
    type: [Schema.Types.ObjectId],
    default: [],
    ref: "Track",
    validate: {
      validator: async function (tracksIds: TrackDocumentInterface[]) {
        const Track = model("Track");
        for (const trackId of tracksIds) {
          const track = await Track.findById(trackId);
          if (!track) {
            return false; // El ID de track no existe en la base de datos
          }
        }

        return true; // Todos los IDs de track existen en la base de datos
      },
      message: "One or more track IDs do not exist.",
    },
  },
  activeChallenges: {
    type: [Schema.Types.ObjectId],
    default: [],
    ref: "Challenge",
  },
  tracksHistory: {
    type: [Object],
    default: [],
    ref: "Track",
  },
});

/**
 * Modelo de mongoose para user, exportado pues se usa en la implementación de los routers
 */
export const User = model<UserDocumentInterface>("User", userSchema);
