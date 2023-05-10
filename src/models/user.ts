import { Document, Schema, model } from 'mongoose';
import { Activity } from '../enums/activityEnum.js';
import { TrackDocumentInterface } from './track.js';
import { TrainingStatisticsInterface } from '../interfaces/trainingStatistics.js';
import { ChallengeDocumentInterface } from './challenge.js';
import { GroupDocumentInterface } from './group.js';

export interface UserDocumentInterface extends Document {
  name: string;
  activities: Activity;
  friends: UserDocumentInterface[];
  groups: GroupDocumentInterface[]
  trainingStatistics: TrainingStatisticsInterface;
  favouriteTracks: TrackDocumentInterface[];
  activeChallenges: ChallengeDocumentInterface[]; 
  tracksHistory: [TrackDocumentInterface, string][];
}

const userSchema = new Schema<UserDocumentInterface>({
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
    type: [Schema.Types.ObjectId],
    default: [],
  },
  groups: {
    type: [Schema.Types.ObjectId],
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
    type: [Schema.Types.ObjectId],
    default: [],
<<<<<<< HEAD
=======
    // validate: {
    //   validator: async function (trackIDs: number[]) {
    //     const Track = model('Track'); // Reemplaza 'Track' con el nombre de tu modelo de rutas
    //     // Verificar cada ID de ruta
    //     for (const trackID of trackIDs) {
    //       const track = await Track.findOne({  });
    //       if (!track) {
    //         return false; // El ID de ruta no existe en la base de datos
    //       }
    //     }
    //     return true; // Todos los IDs de ruta existen en la base de datos
    //   },
    //   message: 'One or more track IDs do not exist.',
    // },
    // TODO: Verificar que los IDs de ruta existen en la base de datos
>>>>>>> 8229e414253ea552a2b07f4ea41806e989694664
  },
  activeChallenges: {
    type: [Schema.Types.ObjectId],
    default: [],
  },
  tracksHistory: {
    type: [[Schema.Types.ObjectId, String]],
    default: [],
  },
});

export const User = model<UserDocumentInterface>('User', userSchema);