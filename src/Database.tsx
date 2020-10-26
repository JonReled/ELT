import { Program } from './Programs';

const defaultExerciseDatabase = [
  { value: 'Bench', text: 'Bench' },
  { value: 'Deadlift', text: 'Deadlift' },
  { value: 'Squat', text: 'Squat' },
];
const defaultUserSettings = {
  weightUnit: 'kg',
  heightUnit: 'cm',
};
const defaultUserPRs = {
  Bench: { tested1RM: 0, estimated1RM: 0 },
  Deadlift: { tested1RM: 0, estimated1RM: 0 },
  Squat: { tested1RM: 0, estimated1RM: 0 },
  Total: { tested1RM: 0, estimated1RM: 0 },
};

const defaultPrograms = {
  'Starting Strength': {
    name: 'Starting Strength',
    author: 'Mark Rippetoe',
    level: 'Beginner',
    days: '3',
    program: [
      [
        { exerciseName: 'Squat', Sets: 3, Reps: 5 },
        { exerciseName: 'Bench', Sets: 3, Reps: 5 },
        { exerciseName: 'Deadlift', Sets: 1, Reps: 5 },
      ],
      [
        { exerciseName: 'Squat', Sets: 3, Reps: 5 },
        { exerciseName: 'Press', Sets: 3, Reps: 5 },
        { exerciseName: 'Deadlift', Sets: 1, Reps: 5 },
      ],
    ],
    notes: 'The goal is to add as much weight per session as possible. Eventually you can switch out deadlifts for rows and do those every other day.',
  },
  'Stronglifts 5x5': {
    name: 'Stronglifts 5x5',
    author: 'Mehdi',
    level: 'Beginner',
    days: '3',
    program: [
      [
        { exerciseName: 'Squat', Sets: 5, Reps: 5 },
        { exerciseName: 'Bench', Sets: 5, Reps: 5 },
        { exerciseName: 'Barbell Row', Sets: 5, Reps: 5 },
      ],
      [
        { exerciseName: 'Squat', Sets: 5, Reps: 5 },
        { exerciseName: 'Press', Sets: 5, Reps: 5 },
        { exerciseName: 'Deadlift', Sets: 1, Reps: 5 },
      ],
    ],
    notes: 'placeholder',
  },
};

interface Exercise {
  value: string;
  text: string;
}

interface ExerciseLogEntry {
  exerciseName: string;
  Sets: number;
  Reps: number;
  Weight: number;
}

export function createExercise(exerciseName: string): void {
  let currentDatabase: Array<Exercise>;
  if (localStorage.getItem('exerciseDatabase') === null) {
    currentDatabase = defaultExerciseDatabase;
  } else {
    currentDatabase = JSON.parse(localStorage.getItem('exerciseDatabase') as string);
  }

  currentDatabase.push({ value: exerciseName, text: exerciseName });
  localStorage.setItem('exerciseDatabase', JSON.stringify(currentDatabase));
}

export function retrieveExercise(): Array<Exercise> {
  if (localStorage.getItem('exerciseDatabase') === null) {
    return defaultExerciseDatabase;
  }
  return JSON.parse(localStorage.getItem('exerciseDatabase') as string);
}

export function addLog(exerciseLog: Array<ExerciseLogEntry>, day: string): void {
  let currentLog: { day: Array<ExerciseLogEntry> };
  if (localStorage.getItem('logDatabase') === null) {
    currentLog = { day: exerciseLog };
  } else {
    currentLog = JSON.parse(localStorage.getItem('logDatabase') as string);
    currentLog[day] = exerciseLog;
  }
  localStorage.setItem('logDatabase', JSON.stringify(currentLog));
}

export function removeLog(day: string): void {
  if (localStorage.getItem('logDatabase') === null) {
    return;
  }
  const currentLog = JSON.parse(localStorage.getItem('logDatabase') as string);
  delete currentLog[day];
  localStorage.setItem('logDatabase', JSON.stringify(currentLog));
}

export function retrieveLog(): { day: Array<ExerciseLogEntry> } {
  let log: { day: Array<ExerciseLogEntry> };
  if (localStorage.getItem('logDatabase') === null) {
    log = { day: [] };
  } else {
    log = JSON.parse(localStorage.getItem('logDatabase') as string);
  }

  return log;
}

export function updateUserSettings(settingName: string, value: string): void {
  if (localStorage.getItem('userSettings') === null) {
    localStorage.setItem('userSettings', JSON.stringify(defaultUserSettings));
  } else {
    const currentSettings = JSON.parse(localStorage.getItem('userSettings') as string);
    currentSettings[settingName] = value;
    localStorage.setItem('userSettings', JSON.stringify(currentSettings));
  }
}

export function retrieveUserSettings(settingName: string): string {
  let returnedSetting: string;
  if (localStorage.getItem('userSettings') === null) {
    returnedSetting = defaultUserSettings[settingName];
  } else {
    returnedSetting = JSON.parse(localStorage.getItem('userSettings') as string)[settingName];
  }

  return returnedSetting;
}

export function retrieveUserPR(): { [k: string]: { tested1RM: number; estimated1RM: number } } {
  if (localStorage.getItem('userPRs') === null) {
    return defaultUserPRs;
  }
  return JSON.parse(localStorage.getItem('userPRs') as string);
}

export function updateUserPR(exerciseName: string, value: number, type: string): void {
  let currentPRs: { [k: string]: { tested1RM: number; estimated1RM: number } };
  if (localStorage.getItem('userPRs') === null) {
    currentPRs = defaultUserPRs;
  } else {
    currentPRs = JSON.parse(localStorage.getItem('userPRs') as string);
  }
  currentPRs[exerciseName][type] = value;
  localStorage.setItem('userPRs', JSON.stringify(currentPRs));
}

export function setUserProgram(program: Omit<Program, 'setViewedName' | 'setEditing'>): void {
  const currentPrograms = JSON.parse(localStorage.getItem('databasePrograms') as string);
  currentPrograms[program.name] = program;
  localStorage.setItem('databasePrograms', JSON.stringify(currentPrograms));
  localStorage.setItem('userProgram', JSON.stringify(program));
}

export function retrievePrograms(): Array<Omit<Program, 'setViewedName' | 'setEditing'>> {
  if (localStorage.getItem('databasePrograms') !== null) {
    return Object.values(JSON.parse(localStorage.getItem('databasePrograms') as string));
  }
  localStorage.setItem('databasePrograms', JSON.stringify(defaultPrograms));
  return Object.values(defaultPrograms);
}
