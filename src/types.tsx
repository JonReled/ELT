export interface Exercise {
  name: string;
  weight: number;
  reps: number;
  date: string;
  estimated: number;
  tested: number;
  bw: number;
}

export type ExerciseForChart = Omit<Exercise, 'bw' | 'name' | 'weight' | 'reps'>;
export type ExerciseForMaxes = Omit<Exercise, 'date' | 'name' | 'weight' | 'reps'>;

export interface Maxes {
  Squat: ExerciseForMaxes;
  Bench: ExerciseForMaxes;
  Deadlift: ExerciseForMaxes;
  Total: ExerciseForMaxes;
}

export interface LogInterface {
  bw: number;
  exercises: ExercisesInterface[];
}

export interface ExercisesInterface {
  name: string;
  sets: { weight: number; reps: number }[];
}
