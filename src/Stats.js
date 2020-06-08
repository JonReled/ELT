import React, { useState, useEffect, useContext } from 'react';
import { retrieveLogDatabase, retrieveUserPR, updateUserPR } from './DatabaseFunctions';
import { Header, Table, Button, Icon } from 'semantic-ui-react';
import { StandardTypeContext } from './Context.js';

const defaultUserPRs = {
  Bench: {tested1RM: 0, estimated1RM: 0},
  Deadlift: {tested1RM: 0, estimated1RM: 0},
  Squat: {tested1RM: 0, estimated1RM: 0},
  Total: {tested1RM: 0, estimated1RM: 0}
}

const strengthStandards = {
  male: {
    67: [6.420, 291.7],
    75: [8.671, 140.7],
    83: [15.74, -389.7],
    90: [3.425, 625.3],
    100: [3.704, 600.3],
    110: [2.546, 713.5],
    125: [3.273, 634.5],
    140: [5.986, 305.2],
    shw: [1.154, 926.6]
  },
}

const ratiosToTotal = {
  Deadlift: 0.3968,
  Squat: 0.3452,
  Bench: 0.2580,
  Total: 1
}

const strengthLevels = {
  untrained: 0.15,
  average: 0.20,
  beginner: 0.35,
  intermediate: 0.50,
  advanced: 0.60,
  elite: 0.70,
  worldClass: 0.80,
  recordBreaker: 0.95
}

function Stats() {
  const [tableRows, setTableRows] = useState([]);
  const [update, setUpdate] = useState(0);

  useEffect(() => {
    let newTableRows = [];

    for (let i = 0; i < Object.keys(retrieveUserPR()).length; i++) {
      const exercise = Object.entries(retrieveUserPR())[i];

      newTableRows.push(<TableRow exerciseName={exercise[0]} estimated1RM={exercise[1].estimated1RM} tested1RM={exercise[1].tested1RM} standard={calculateUserExerciseLevel(exercise[0], [exercise[1].estimated1RM, exercise[1].tested1RM])} />)
    }
    setTableRows(newTableRows);

  }, [update]);

  function brzyckiEquation(weight, reps) {
    return weight * (36 / (37 - reps));
  }

  function calculateOneRM() {
    const LogDatabase = Object.entries(retrieveLogDatabase());
    setUpdate(update + 1);
    localStorage.setItem('userPRs', JSON.stringify(defaultUserPRs));

    for (let i = 0; i < LogDatabase.length; i++) {
      const Log = LogDatabase[i][1];

      for (let j = 0; j < Object.keys(Log).length; j++) {
        let exercise = Log[j];
        const currentEstimatedPR = retrieveUserPR()[exercise.exerciseName].estimated1RM;
        const currentTestedPR =  retrieveUserPR()[exercise.exerciseName].tested1RM;

        if (brzyckiEquation(exercise.Weight, exercise.Reps) > currentEstimatedPR) {
          let estimated1RM = Math.floor(brzyckiEquation(exercise.Weight, exercise.Reps));
          updateUserPR(exercise.exerciseName, estimated1RM, 'estimated1RM');
        }

        if (exercise.Weight > currentTestedPR) {
          updateUserPR(exercise.exerciseName, exercise.Weight, 'tested1RM')
        }
      }

      updateUserPR('Total', retrieveUserPR()['Bench'].estimated1RM + retrieveUserPR()['Squat'].estimated1RM + retrieveUserPR()['Deadlift'].estimated1RM, 'estimated1RM')
      updateUserPR('Total', retrieveUserPR()['Bench'].tested1RM + retrieveUserPR()['Squat'].tested1RM + retrieveUserPR()['Deadlift'].tested1RM, 'tested1RM')
    }
  }

  function calculateUserExerciseLevel(exerciseName, user1RM) {
    let levelArray = [];

    for (let j = 0; j < user1RM.length; j++) {
      for (let i = Object.keys(strengthLevels).length - 1; i > 0; i--) {

        if (user1RM[j] >= calculateUserWorldRecord(75, 'male', exerciseName) * Object.values(strengthLevels)[i]) {
  
          levelArray.push(Object.keys(strengthLevels)[i]);
          break;
        }
      }
    }

    return levelArray;
  }

  return(
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <LogTable tableRows={tableRows} />
      <Button style={{margin: '0'}} onClick={calculateOneRM}>Calculate 1RM</Button>
    </div>
  )
}

function LogTable(props) {
  const [standardType, setStandardType] = useContext(StandardTypeContext);

  function changeLevel() {
    (standardType === 'Estimated Level') ? setStandardType('Tested Level') : setStandardType('Estimated Level');
  }

  return (
    <Table celled padded style={{maxWidth: '720px'}}>
      <Table.Header>
        <Table.Row style={{textAlign: 'center', fontSize: '1.5rem'}}>
          <Table.HeaderCell style={{width: '25%'}}>Exercise</Table.HeaderCell>
          <Table.HeaderCell style={{width: '25%'}}>Tested 1RM</Table.HeaderCell>
          <Table.HeaderCell style={{width: '25%'}}>Estimated 1RM</Table.HeaderCell>
          <Table.HeaderCell style={{position: 'relative'}}>{standardType} <Icon onClick={changeLevel} style={{position: 'absolute', right: '3px', bottom: '6.5px', cursor: 'pointer'}} name="hand pointer outline" /></Table.HeaderCell>
        </Table.Row>
      </Table.Header>
  
      <Table.Body>
        {props.tableRows}
      </Table.Body>
    </Table>
  )
}
  
function TableRow(props) {
  const [standardType, setStandardType] = useContext(StandardTypeContext);

  return (
    <Table.Row>
      <Table.Cell>
        <Header as='h4' textAlign='center'>{props.exerciseName}</Header>
      </Table.Cell>
      <Table.Cell textAlign='center' >{props.tested1RM}</Table.Cell>
      <Table.Cell textAlign='center'>{props.estimated1RM}</Table.Cell>
      <Table.Cell textAlign='center'>{standardType === 'Estimated Level' ? props.standard[0] : props.standard[1]}</Table.Cell>
    </Table.Row>
  )
}

function calculateUserWorldRecord(bw, gender, exerciseName) {

  if (gender === 'male') {
    if (bw > 140) {
      return strengthStandards.male.shw[0] * bw + strengthStandards.male.shw[1];
      
    } else {
      const weightClasses = Object.keys(strengthStandards.male);

      for (let i = 0; i < weightClasses.length - 1; i++) {
        if (bw < weightClasses[i]) {

          return Math.round((Object.values(strengthStandards.male)[i][0] * bw + Object.values(strengthStandards.male)[i][1]) * ratiosToTotal[exerciseName]);
        }
      }
    }
  }
}

export default Stats;