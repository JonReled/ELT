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

export function addExerciseToDatabase(exerciseName: string): void {
  let currentDatabase: Array<Exercise>;
  if (localStorage.getItem('exerciseDatabase') === null) {
    currentDatabase = defaultExerciseDatabase;
  } else {
    currentDatabase = JSON.parse(localStorage.getItem('exerciseDatabase') as string);
  }

  currentDatabase.push({ value: exerciseName, text: exerciseName });
  localStorage.setItem('exerciseDatabase', JSON.stringify(currentDatabase));
}

export function retrieveExerciseDatabase(): Array<Exercise> {
  if (localStorage.getItem('exerciseDatabase') === null) {
    return defaultExerciseDatabase;
  }
  return JSON.parse(localStorage.getItem('exerciseDatabase') as string);
}

export function addLogToDatabase(exerciseLog: Array<ExerciseLogEntry>, day: string): void {
  let currentLog: { day: Array<ExerciseLogEntry> };
  if (localStorage.getItem('logDatabase') === null) {
    currentLog = { day: exerciseLog };
  } else {
    currentLog = JSON.parse(localStorage.getItem('logDatabase') as string);
    currentLog[day] = exerciseLog;
  }
  localStorage.setItem('logDatabase', JSON.stringify(currentLog));
}

export function removeLogFromDatabase(day: string): void {
  if (localStorage.getItem('logDatabase') === null) {
    return;
  }
  const currentLog = JSON.parse(localStorage.getItem('logDatabase') as string);
  delete currentLog[day];
  localStorage.setItem('logDatabase', JSON.stringify(currentLog));
}

export function retrieveLogDatabase(): { day: Array<ExerciseLogEntry> } {
  let log: { day: Array<ExerciseLogEntry> };
  if (localStorage.getItem('logDatabase') === null) {
    log = { day: [] };
  } else {
    log = JSON.parse(localStorage.getItem('logDatabase') as string);
  }

  return log;
}

export function updateUserSettingsDatabase(settingName: string, value: string): void {
  if (localStorage.getItem('userSettings') === null) {
    localStorage.setItem('userSettings', JSON.stringify(defaultUserSettings));
  } else {
    const currentSettings = JSON.parse(localStorage.getItem('userSettings') as string);
    currentSettings[settingName] = value;
    localStorage.setItem('userSettings', JSON.stringify(currentSettings));
  }
}

export function retrieveUserSettingsDatabase(settingName: string): string {
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
