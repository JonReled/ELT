import React, { useState, useEffect, useContext, ReactElement } from 'react';
import { Header, Table, Button, Icon } from 'semantic-ui-react';
import { retrieveLogDatabase, retrieveUserPR, updateUserPR } from './Database';
import { StandardTypeContext } from './Context';
import Chart, { kemmlerEquation } from './Chart';

const defaultUserPRs = {
  Bench: { tested1RM: 0, estimated1RM: 0 },
  Deadlift: { tested1RM: 0, estimated1RM: 0 },
  Squat: { tested1RM: 0, estimated1RM: 0 },
  Total: { tested1RM: 0, estimated1RM: 0 },
};

const strengthStandards = {
  male: {
    67: [6.42, 291.7],
    75: [8.671, 140.7],
    83: [15.74, -389.7],
    90: [3.425, 625.3],
    100: [3.704, 600.3],
    110: [2.546, 713.5],
    125: [3.273, 634.5],
    140: [5.986, 305.2],
    shw: [1.154, 926.6],
  },
};

const ratiosToTotal = {
  Deadlift: 0.3968,
  Squat: 0.3452,
  Bench: 0.258,
  Total: 1,
};

const strengthLevels = {
  untrained: [0.15, 'gray'],
  average: [0.2, 'teal'],
  beginner: [0.35, 'green'],
  intermediate: [0.5, 'orange'],
  advanced: [0.6, 'chocolate'],
  elite: [0.7, 'crimson'],
  worldClass: [0.8, 'darkSlateGray'],
  recordBreaker: [0.95, 'black'],
};

function calculateUserWorldRecord(bw: number, gender: string, exerciseName: string): number {
  if (gender === 'male') {
    if (bw > 140) {
      return strengthStandards.male.shw[0] * bw + strengthStandards.male.shw[1];
    }
    const weightClasses: number[] = Object.keys(strengthStandards.male).map((key) => parseInt(key, 10));

    for (let i = 0; i < weightClasses.length; i++) {
      if (bw < weightClasses[i]) {
        return Math.round((Object.values(strengthStandards.male)[i][0] * bw + Object.values(strengthStandards.male)[i][1]) * ratiosToTotal[exerciseName]);
      }
    }
  }
  return 0;
}

function Stats(): ReactElement {
  const [tableRows, setTableRows] = useState<any[]>([]);
  const [update, setUpdate] = useState(0);

  function calculateUserExerciseLevel(exerciseName, user1RM) {
    const levelArray: any[] = [];

    for (let j = 0; j < user1RM.length; j++) {
      let strengthLevelMultiplier: number = Object.values(strengthLevels)[0][0] as number;
      if (user1RM[j] < calculateUserWorldRecord(78, 'male', exerciseName) * strengthLevelMultiplier) {
        levelArray.push([Object.keys(strengthLevels)[0], Object.values(strengthLevels)[0][1]]);
      }

      for (let i = Object.keys(strengthLevels).length - 1; i > 0; i--) {
        strengthLevelMultiplier = Object.values(strengthLevels)[i][0] as number;
        if (user1RM[j] >= calculateUserWorldRecord(78, 'male', exerciseName) * strengthLevelMultiplier) {
          levelArray.push([Object.keys(strengthLevels)[i], Object.values(strengthLevels)[i][1]]);
          break;
        }
      }
    }

    return levelArray;
  }
  
  useEffect(() => {
    const newTableRows: JSX.Element[] = [];

    for (let i = 0; i < Object.keys(retrieveUserPR()).length; i++) {
      const exercise = Object.entries(retrieveUserPR())[i];

      newTableRows.push(
        <TableRow
          exerciseName={exercise[0]}
          estimated1RM={exercise[1].estimated1RM}
          tested1RM={exercise[1].tested1RM}
          standard={calculateUserExerciseLevel(exercise[0], [exercise[1].estimated1RM, exercise[1].tested1RM])}
        />,
      );
    }
    setTableRows(newTableRows);
  }, [update]);

  function calculateOneRM() {
    const LogDatabase = Object.entries(retrieveLogDatabase());
    setUpdate(update + 1);
    localStorage.setItem('userPRs', JSON.stringify(defaultUserPRs));

    for (let i = 0; i < LogDatabase.length; i++) {
      const Log = LogDatabase[i][1];

      for (let j = 0; j < Object.keys(Log).length; j++) {
        const exercise = Log[j];

        if (!['Bench', 'Squat', 'Deadlift'].includes(exercise.exerciseName)) {
          break;
        }
        const currentEstimatedPR = retrieveUserPR()[exercise.exerciseName].estimated1RM;
        const currentTestedPR = retrieveUserPR()[exercise.exerciseName].tested1RM;

        if (kemmlerEquation(exercise.Weight, exercise.Reps) > currentEstimatedPR) {
          const estimated1RM = Math.floor(kemmlerEquation(exercise.Weight, exercise.Reps));
          updateUserPR(exercise.exerciseName, estimated1RM, 'estimated1RM');
        }

        if (exercise.Weight > currentTestedPR) {
          updateUserPR(exercise.exerciseName, exercise.Weight, 'tested1RM');
        }
      }

      updateUserPR('Total', retrieveUserPR().Bench.estimated1RM + retrieveUserPR().Squat.estimated1RM + retrieveUserPR().Deadlift.estimated1RM, 'estimated1RM');
      updateUserPR('Total', retrieveUserPR().Bench.tested1RM + retrieveUserPR().Squat.tested1RM + retrieveUserPR().Deadlift.tested1RM, 'tested1RM');
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <LogTable tableRows={tableRows} />
      <Button style={{ margin: '0' }} onClick={calculateOneRM}>
        Calculate 1RM
      </Button>
      <Chart />
    </div>
  );
}

function LogTable(props) {
  const standardType = useContext(StandardTypeContext);
  const { tableRows } = props;

  function changeLevel() {
    if (standardType.type === 'Estimated Level') {
      return standardType.setType('Tested Level');
    }
    return standardType.setType('Estimated Level');
  }

  return (
    <Table celled padded style={{ maxWidth: '720px' }}>
      <Table.Header>
        <Table.Row style={{ textAlign: 'center', fontSize: '1.5rem' }}>
          <Table.HeaderCell style={{ width: '25%' }}>Exercise</Table.HeaderCell>
          <Table.HeaderCell style={{ width: '25%' }}>Tested 1RM</Table.HeaderCell>
          <Table.HeaderCell style={{ width: '25%' }}>Estimated 1RM</Table.HeaderCell>
          <Table.HeaderCell style={{ position: 'relative' }}>
            {standardType.type}{' '}
            <Icon
              onClick={changeLevel}
              style={{
                position: 'absolute',
                right: '3px',
                bottom: '6.5px',
                cursor: 'pointer',
              }}
              name="hand pointer outline"
            />
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>{tableRows}</Table.Body>
    </Table>
  );
}

function TableRow(props) {
  const standardType = useContext(StandardTypeContext);
  const { exerciseName, tested1RM, estimated1RM, standard } = props;

  return (
    <Table.Row>
      <Table.Cell>
        <Header as="h4" textAlign="center">
          {exerciseName}
        </Header>
      </Table.Cell>
      <Table.Cell textAlign="center">{tested1RM}</Table.Cell>
      <Table.Cell textAlign="center">{estimated1RM}</Table.Cell>
      <Table.Cell textAlign="center">
        {standardType.type === 'Estimated Level' ? <h1 style={{ color: standard[0][1] }}>{standard[0][0]}</h1> : <h1 style={{ color: standard[1][1] }}>{standard[1][0]}</h1>}
      </Table.Cell>
    </Table.Row>
  );
}

export default Stats;
