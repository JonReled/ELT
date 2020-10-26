import React, { useContext, ReactElement } from 'react';
import { Header, Table, Button, Icon } from 'semantic-ui-react';
import { retrieveLog, retrieveUserPR, updateUserPR } from './Database';
import { StandardTypeContext } from './Context';
import Chart, { kemmlerEquation } from './Chart';

const defaultUserPRs = {
  Bench: { tested1RM: 0, estimated1RM: 0 },
  Deadlift: { tested1RM: 0, estimated1RM: 0 },
  Squat: { tested1RM: 0, estimated1RM: 0 },
  Total: { tested1RM: 0, estimated1RM: 0 },
};

function calculateUserWorldRecord(bw: number, gender: 'male' | 'female', exerciseName: string): number {
  const ratiosToTotal = {
    Deadlift: 0.3968,
    Squat: 0.3452,
    Bench: 0.258,
    Total: 1,
  };

  if (gender === 'male') {
    if (bw < 67) {
      return Math.round((6.42 * bw + 291.7) * ratiosToTotal[exerciseName]);
    }
    if (bw < 75) {
      return Math.round((8.671 * bw + 140.7) * ratiosToTotal[exerciseName]);
    }
    if (bw < 83) {
      return Math.round((15.74 * bw - 389.7) * ratiosToTotal[exerciseName]);
    }
    if (bw < 90) {
      return Math.round((3.425 * bw + 625.3) * ratiosToTotal[exerciseName]);
    }
    if (bw < 100) {
      return Math.round((3.704 * bw + 600.3) * ratiosToTotal[exerciseName]);
    }
    if (bw < 110) {
      return Math.round((2.546 * bw + 713.5) * ratiosToTotal[exerciseName]);
    }
    if (bw < 125) {
      return Math.round((3.273 * bw + 634.5) * ratiosToTotal[exerciseName]);
    }
    if (bw < 140) {
      return Math.round((5.986 * bw + 305.2) * ratiosToTotal[exerciseName]);
    }
    return Math.round((1.154 * bw + 926.6) * ratiosToTotal[exerciseName]);
  }
  if (bw < 48) {
    return Math.round((21 * bw - 569.0) * ratiosToTotal[exerciseName]);
  }
  if (bw < 52) {
    return Math.round((15.54 * bw - 315.1) * ratiosToTotal[exerciseName]);
  }
  if (bw < 56) {
    return Math.round((15.09 * bw - 292.3) * ratiosToTotal[exerciseName]);
  }
  if (bw < 67.5) {
    return Math.round((16.18 * bw - 353.4) * ratiosToTotal[exerciseName]);
  }
  if (bw < 75) {
    return Math.round((3.963 * bw + 351.3) * ratiosToTotal[exerciseName]);
  }
  if (bw < 90) {
    return Math.round((6.419 * bw + 169.4) * ratiosToTotal[exerciseName]);
  }
  return Math.round((1.005 * bw + 610.6) * ratiosToTotal[exerciseName]);
}

function calculateUserExerciseLevel(exerciseName, user1RM) {
  const worldRecord = calculateUserWorldRecord(122, 'male', exerciseName);
  if (user1RM > worldRecord * 0.95) {
    return { level: 'recordBreaker', color: 'black' };
  }
  if (user1RM > worldRecord * 0.8) {
    return { level: 'worldClass', color: 'darkSlateGray' };
  }
  if (user1RM > worldRecord * 0.7) {
    return { level: 'elite', color: 'crimson' };
  }
  if (user1RM > worldRecord * 0.6) {
    return { level: 'advanced', color: 'chocolate' };
  }
  if (user1RM > worldRecord * 0.5) {
    return { level: 'intermediate', color: 'orange' };
  }
  if (user1RM > worldRecord * 0.35) {
    return { level: 'beginner', color: 'green' };
  }
  if (user1RM > worldRecord * 0.2) {
    return { level: 'average', color: 'teal' };
  }
  return { level: 'untrained', color: 'gray' };
}

function Stats(): ReactElement {
  function calculateOneRM() {
    const LogDatabase = Object.values(retrieveLog());
    localStorage.setItem('userPRs', JSON.stringify(defaultUserPRs));

    for (let i = 0; i < LogDatabase.length; i++) {
      const Log = LogDatabase[i];

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
      <LogTable />
      <Button style={{ margin: '0' }} onClick={calculateOneRM}>
        Calculate 1RM
      </Button>
      <Chart />
    </div>
  );
}

function LogTable(): ReactElement {
  const standardType = useContext(StandardTypeContext);

  function changeLevel(): void {
    standardType.set(standardType.value === 'Estimated Level' ? 'Tested Level' : 'Estimated Level');
  }

  return (
    <Table celled padded style={{ maxWidth: '720px' }}>
      <Table.Header>
        <Table.Row style={{ textAlign: 'center', fontSize: '1.5rem' }}>
          <Table.HeaderCell style={{ width: '25%' }}>Exercise</Table.HeaderCell>
          <Table.HeaderCell style={{ width: '25%' }}>Tested 1RM</Table.HeaderCell>
          <Table.HeaderCell style={{ width: '25%' }}>Estimated 1RM</Table.HeaderCell>
          <Table.HeaderCell style={{ position: 'relative' }}>
            {standardType.value}{' '}
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

      <Table.Body>
        {Object.entries(retrieveUserPR()).map((exercise) => (
          <TableRow
            exerciseName={exercise[0]}
            estimated1RM={exercise[1].estimated1RM}
            tested1RM={exercise[1].tested1RM}
            standard={{ estimated: calculateUserExerciseLevel(exercise[0], exercise[1].estimated1RM), tested: calculateUserExerciseLevel(exercise[0], exercise[1].tested1RM) }}
          />
        ))}
      </Table.Body>
    </Table>
  );
}

function TableRow({
  exerciseName,
  tested1RM,
  estimated1RM,
  standard,
}: {
  exerciseName: string;
  tested1RM: number;
  estimated1RM: number;
  standard: { estimated: { level: string; color: string }; tested: { level: string; color: string } };
}): ReactElement {
  const standardType = useContext(StandardTypeContext);

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
        {standardType.value === 'Estimated Level' ? (
          <h1 style={{ color: standard.estimated.color }}>{standard.estimated.level}</h1>
        ) : (
          <h1 style={{ color: standard.tested.color }}>{standard.tested.level}</h1>
        )}
      </Table.Cell>
    </Table.Row>
  );
}

export default Stats;
