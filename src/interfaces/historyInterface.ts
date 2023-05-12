import { Schema } from "mongoose";

/**
 * Interfaz que define el formato de las estadísticas de entrenamiento
 */
export interface HistoryData {
  track: Schema.Types.ObjectId;
  date: Date;
}
