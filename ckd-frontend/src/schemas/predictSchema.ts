import { z } from 'zod';

export const predictSchema = z.object({
  age: z.string().min(1, "Age is required"),
  bloodPressure: z.string().min(1, "Blood pressure is required"),
  specificGravity: z.string().min(1, "Specific gravity is required"),
  albumin: z.string().min(1, "Albumin level is required"),
  sugar: z.string().min(1, "Sugar level is required"),
  redBloodCells: z.string().optional(),
  pusCell: z.string().optional(),
  pusCellClumps: z.string().optional(),
  bacteria: z.string().optional(),
  bloodGlucoseRandom: z.string().optional(),
  bloodUrea: z.string().optional(),
  serumCreatinine: z.string().optional(),
  sodium: z.string().optional(),
  potassium: z.string().optional(),
  hemoglobin: z.string().optional(),
  packedCellVolume: z.string().optional(),
  whiteBloodCellCount: z.string().optional(),
  redBloodCellCount: z.string().optional(),
  hypertension: z.string().optional(),
  diabetesMellitus: z.string().optional(),
  coronaryArteryDisease: z.string().optional(),
  appetite: z.string().optional(),
  pedalEdema: z.string().optional(),
  anemia: z.string().optional()
});

export type PredictInput = z.infer<typeof predictSchema>;
