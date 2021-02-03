import { getLogsOfExercise } from 'Database';
import React, { useState, ReactElement, useEffect } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { Dropdown, Message } from 'semantic-ui-react';

function Chart(): ReactElement {
  const [chartExercise, setChartExercise] = useState<string>('Bench');
  const [chartType, setChartType] = useState<string>('estimated');
  const [chartData, setChartData] = useState<Array<{ date: string; estimated: number; tested: number }>>([]);
  const [error, setError] = useState<string>('');
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

  useEffect(() => {
    getLogsOfExercise(chartExercise)
      .then((res) => setChartData(res))
      .catch(() => setError('An error has occurred while loading the chart.'));
  }, [chartExercise]);

  return (
    <div>
      <span>
        View <Dropdown inline options={TypeDropdown} defaultValue={TypeDropdown[0].value} onChange={(_, data) => setChartType(data.value as string)} />
        1RM per Day for <Dropdown inline options={ExerciseDropdown} defaultValue={ExerciseDropdown[0].value} onChange={(_, data) => setChartExercise(data.value as string)} />
      </span>
      <LineChart width={600} height={300} data={chartData}>
        <Line type="monotone" dataKey={`${chartType}`} stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="date" allowDataOverflow />
        <YAxis label={{ value: 'Weight', angle: -90, position: 'insideLeft' }} unit="kg" />
        <Tooltip />
      </LineChart>
      <Message negative style={{ display: error ? 'block' : 'none' }} header={error} />
    </div>
  );
}

export default Chart;
