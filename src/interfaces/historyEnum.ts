import { Schema } from 'mongoose';

/**
 * Interfaz que define el formato de las estadísticas de entrenamiento
 */
export interface HistoryData {
  id: Schema.Types.ObjectId;
  date: Date;
}
