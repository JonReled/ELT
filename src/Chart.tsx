import React, { useState, ReactElement } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Dropdown } from 'semantic-ui-react';
import { retrieveLogDatabase } from './Database';

const ExerciseDropdown = [
  {
    text: 'Bench',
    value: 'Bench',
  },
  {
    text: 'Deadlift',
    value: 'Deadlift',
  },
  {
    text: 'Squat',
    value: 'Squat',
  },
];

const TypeDropdown = [
  {
    text: 'Estimated',
    value: 'estimated',
  },
  {
    text: 'Tested',
    value: 'tested',
  },
];

export function kemmlerEquation(weight: number, reps: number): number {
  return weight * (0.988 + 0.0104 * reps + 0.0019 * reps * reps - 0.0000584 * reps * reps * reps);
}

function createCharts(exerciseName: string): Array<[string, { estimated: number; tested: number }]> {
  const LogDatabase = Object.entries(retrieveLogDatabase());
  const dailyPRs: Array<[string, { estimated: number; tested: number }]> = [];

  for (let i = 0; i < LogDatabase.length; i++) {
    const Log = LogDatabase[i][1];
    const currentPRs = {
      estimated: 0,
      tested: 0,
    };

    for (let j = 0; j < Log.length; j++) {
      const exercise = Log[j];
      const estimated1RM = Math.floor(kemmlerEquation(exercise.Weight, exercise.Reps));

      if (exerciseName !== exercise.exerciseName) continue;

      if (estimated1RM > currentPRs.estimated) {
        currentPRs.estimated = estimated1RM;
      }
      if (exercise.Weight > currentPRs.tested) {
        currentPRs.tested = exercise.Weight;
      }
    }
    if (currentPRs.tested === 0) continue;

    dailyPRs.push([LogDatabase[i][0], currentPRs]);
  }

  return dailyPRs;
}

function Chart(): ReactElement {
  const [chartExercise, setChartExercise] = useState('Bench');
  const [chartType, setChartType] = useState('estimated');

  return (
    <div>
      <span>
        View <Dropdown inline options={TypeDropdown} defaultValue={TypeDropdown[0].value} onChange={(_, data) => setChartType(data.value as string)} />
        1RM per Day for <Dropdown inline options={ExerciseDropdown} defaultValue={ExerciseDropdown[0].value} onChange={(_, data) => setChartExercise(data.value as string)} />
      </span>
      <LineChart width={600} height={300} data={createCharts(chartExercise)}>
        <Line type="monotone" dataKey={`[1]${chartType}`} stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="[0]" allowDataOverflow />
        <YAxis label={{ value: 'Weight', angle: -90, position: 'insideLeft' }} unit="kg" />
      </LineChart>
    </div>
  );
}

export default Chart;
