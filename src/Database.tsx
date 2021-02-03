import { ExerciseForChart, Maxes, Exercise, LogInterface } from 'types';
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

export function kemmlerEquation(weight: number, reps: number): number {
  // kemmler's equation for estimating 1rmaxes stops working after 24 reps so I'm making sure no errors occur.
  if (reps > 24) {
    return weight * (0.988 + 0.0104 * 24 + 0.0019 * 24 ** 2 - 0.0000584 * 24 ** 3);
  }
  if (reps < 0) {
    return 0;
  }
  return weight * (0.988 + 0.0104 * reps + 0.0019 * reps ** 2 - 0.0000584 * reps ** 3);
}

function fetchWrapped(url, func): any {
  return fetch('http://93.108.171.191:9000/checkToken', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
    .then((res) => {
      if (res.ok) {
        return fetch(url, func);
      }
      throw Error();
    })
    .catch((err) => {
      window.location.reload();
    });
}

export async function checkAuth(): Promise<boolean> {
  const res = await fetch('http://93.108.171.191:9000/checkToken', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  return res.ok;
}

export async function postLogin(userData: { identification: string; password: string }): Promise<void> {
  const res = await fetch('http://93.108.171.191:9000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
    credentials: 'include',
  });
  if (res.ok) {
    window.location.reload();
    return;
  }
  throw new Error(String(res.status));
}

export async function postRegister(userData: { username: string; email: string; password: string }): Promise<boolean> {
  const res = await fetch('http://93.108.171.191:9000/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  if (res.ok) {
    return true;
  }
  throw new Error(String(res.status));
}

export async function getLogout(): Promise<void> {
  await fetch('http://93.108.171.191:9000/logout', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  window.location.reload();
}

export async function getLogsOfExercise(name: string): Promise<Array<ExerciseForChart>> {
  const dailyPRs: Array<ExerciseForChart> = [];
  try {
    const res = await fetchWrapped(`http://93.108.171.191:9000/charts?name=${name}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (res.ok) {
      const logs: { ['date']: { weight: number; reps: number } } = JSON.parse(await res.text()).reduce((acc, cur) => {
        if (acc[cur.date]) {
          acc[cur.date].push({ weight: Number(cur.weight), reps: Number(cur.reps) });
        } else {
          acc[cur.date] = [{ weight: Number(cur.weight), reps: Number(cur.reps) }];
        }
        return acc;
      }, {});

      for (let i = 0; i < Object.keys(logs).length; i++) {
        const date = Object.keys(logs)[i];
        const currentPRs = {
          estimated: 0,
          tested: 0,
        };

        for (let j = 0; j < logs[date].length; j++) {
          const estimated1RM = Math.floor(kemmlerEquation(logs[date][j].weight, logs[date][j].reps));

          if (estimated1RM > currentPRs.estimated) {
            currentPRs.estimated = estimated1RM;
          }
          if (logs[date][j].weight > currentPRs.tested) {
            currentPRs.tested = logs[date][j].weight;
          }
        }

        dailyPRs.push({ date, estimated: currentPRs.estimated, tested: currentPRs.tested });
      }
      return dailyPRs;
    }
    throw res.status;
  } catch (err) {
    throw new Error(err);
  }
}

export async function getMaxes(): Promise<Maxes> {
  const res = await fetch(`http://93.108.171.191:9000/stats`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  try {
    if (res.ok) {
      const userPRs: Maxes = {
        Squat: { estimated: 0, tested: 0, bw: 0 },
        Bench: { estimated: 0, tested: 0, bw: 0 },
        Deadlift: { estimated: 0, tested: 0, bw: 0 },
        Total: { estimated: 0, tested: 0, bw: 0 },
      };
      const logs: Array<Omit<Exercise, 'estimated' | 'tested'>> = JSON.parse(await res.text());

      for (let i = 0; i < logs.length; i++) {
        const { name, weight, reps, bw } = logs[i];

        const currentEstimatedPR = userPRs[name].estimated;
        const currentTestedPR = userPRs[name].tested;

        if (kemmlerEquation(weight, reps) > currentEstimatedPR) {
          userPRs[name].bw = Math.max(bw, userPRs[name].bw);
          userPRs[name].estimated = Math.floor(kemmlerEquation(weight, reps));
        }

        if (weight > currentTestedPR) {
          userPRs[name].bw = Math.max(bw, userPRs[name].bw);
          userPRs[name].tested = weight;
        }
      }

      userPRs.Total.estimated = userPRs.Bench.estimated + userPRs.Squat.estimated + userPRs.Deadlift.estimated;
      userPRs.Total.tested = userPRs.Bench.tested + userPRs.Squat.tested + userPRs.Deadlift.tested;
      userPRs.Total.bw = Math.max(userPRs.Bench.bw, userPRs.Squat.bw, userPRs.Deadlift.bw);
      localPostUserPR(userPRs);
      return userPRs;
    }
    throw res.status;
  } catch (err) {
    throw new Error(err);
  }
}

export function localPostUserPR(userPRs: Maxes): void {
  localStorage.setItem('userPRs', JSON.stringify(userPRs));
}

export function localGetUserPR(): Maxes {
  return JSON.parse(localStorage.getItem('userPRs') as string);
}

export async function getDates(): Promise<Array<string>> {
  const res = await fetch('http://93.108.171.191:9000/workout/dates', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  try {
    if (res.ok) {
      return JSON.parse(await res.text());
    }
    throw res.status;
  } catch (err) {
    throw new Error(err);
  }
}

export async function getWorkoutLog(date: string): Promise<LogInterface> {
  const res = await fetch(`http://93.108.171.191:9000/workout/log?date=${date}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  try {
    if (res.ok) {
      const arr = JSON.parse(await res.text());

      const obj: LogInterface = {
        bw: arr[0].bw,
        exercises: arr.reduce((acc, cur) => {
          if (acc[cur.id]) {
            acc[cur.id].sets.push({ weight: cur.weight, reps: cur.reps });
          } else {
            acc[cur.id] = { name: cur.name, sets: [{ weight: cur.weight, reps: cur.reps }] };
          }
          return acc;
        }, {}),
      };
      return obj;
    }
    throw res.status;
  } catch (err) {
    throw new Error(err);
  }
}

export function createExercise(exerciseName: string): void {
  let currentDatabase: any;
  if (localStorage.getItem('exerciseDatabase') === null) {
    currentDatabase = defaultExerciseDatabase;
  } else {
    currentDatabase = JSON.parse(localStorage.getItem('exerciseDatabase') as string);
  }

  currentDatabase.push({ value: exerciseName, text: exerciseName });
  localStorage.setItem('exerciseDatabase', JSON.stringify(currentDatabase));
}

export function retrieveExercise(): Array<{ value: string; text: string }> {
  if (localStorage.getItem('exerciseDatabase') === null) {
    return defaultExerciseDatabase;
  }
  return JSON.parse(localStorage.getItem('exerciseDatabase') as string);
}

export function addLog(exerciseLog: any, bw: number, date: string): void {
  console.log(exerciseLog);
  fetch('http://93.108.171.191:9000/workout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ date, bw, exerciseLog }),
    credentials: 'include',
  }).then((res) => console.log(res.status));
}

export function removeLog(date: string): void {
  fetchWrapped(`http://93.108.171.191:9000/workout?date=${date}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  }).then((res) => console.log(res.status));
}

export function getAllLogs(): any {
  return 'a';
}

export function retrieveLog(date: string): any {
  fetch(`http://93.108.171.191:9000/workout/log?date=${date}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  }).then((res) => {
    if (res.status === 200) {
      return res.text();
    }
    return 'error';
  });
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
