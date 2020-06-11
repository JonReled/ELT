import React, {useState, useEffect} from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { retrieveLogDatabase } from './DatabaseFunctions';
import { Dropdown, Button } from 'semantic-ui-react';

function kemmlerEquation(weight, reps) {
  return weight * (0.988 + 0.0104*reps + 0.0019*reps*reps - 0.0000584*reps*reps*reps);
}

function createCharts(exerciseName) {
  const LogDatabase = Object.entries(retrieveLogDatabase());
  let dailyPRs = [];

  for (let i = 0; i < LogDatabase.length; i++) {
    let Log = LogDatabase[i][1];
    let currentPRs = {
      estimated: 0,
      tested: 0
    }

    for (let j = 0; j < Log.length; j++) {
      let exercise = Log[j];
      let estimated1RM = Math.floor(kemmlerEquation(exercise.Weight, exercise.Reps));

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

export function Chart() {
  const [chartExercise, setChartExercise] = useState('Bench');
  const [chartType, setChartType] = useState('estimated');

  return(
    <div>
      <span>
      View {' '}
      <Dropdown
        inline
        options={TypeDropdown}
        defaultValue={TypeDropdown[0].value}
        onChange={(_, data) => setChartType(data.value)}
      />
      1RM per Day for {' '}
      <Dropdown
        inline
        options={ExerciseDropdown}
        defaultValue={ExerciseDropdown[0].value}
        onChange={(_, data) => setChartExercise(data.value)}
      />
      </span>
      <LineChart width={600} height={300} data={createCharts(chartExercise)}>
        <Line type="monotone" dataKey={`[1]${chartType}`} stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey={`[0]`} allowDataOverflow={true} />
        <YAxis label={{ value: 'Weight', angle: -90, position: 'insideLeft' }} unit="kg" />
      </LineChart>
    </div>
  );
}

const ExerciseDropdown = [
  {
    key: 'Bench',
    text: 'Bench',
    value: 'Bench',
  },
  {
    key: 'Deadlift',
    text: 'Deadlift',
    value: 'Deadlift',
  },
  {
    key: 'Squat',
    text: 'Squat',
    value: 'Squat',
  }
]

const TypeDropdown = [
  {
    key: 'Estimated',
    text: 'Estimated',
    value: 'estimated',
  },
  {
    key: 'Tested',
    text: 'Tested',
    value: 'tested',
  }
]
