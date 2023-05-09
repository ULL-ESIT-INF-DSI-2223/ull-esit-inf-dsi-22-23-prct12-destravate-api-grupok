/**
 * Interfaz que define el formato de las estadísticas de entrenamiento
 */
export interface TrainingStatisticsInterface {
  week: { km: number; elevationGain: number };
  month: { km: number; elevationGain: number };
  year: { km: number; elevationGain: number };
}