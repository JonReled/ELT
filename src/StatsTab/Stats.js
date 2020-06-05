import React, { useState, useEffect } from 'react';
import { retrieveLogDatabase, retrieveUserPR, updateUserPR } from '../DatabaseFunctions';
import { Header, Table, Button } from 'semantic-ui-react';
import { defaultUserPRs } from '../SettingsTab/Settings';

function Stats() {
  const [tableRows, setTableRows] = useState([]);
  const [update, setUpdate] = useState(0);

  useEffect(() => {
    let newTableRows = [];

    for (let i = 0; i < Object.keys(retrieveUserPR()).length; i++) {
      const exercise = Object.entries(retrieveUserPR())[i];

      newTableRows.push(<TableRow exerciseName={exercise[0]} estimated1RM={exercise[1].estimated1RM} tested1RM={exercise[1].tested1RM} />)
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
        const currentEstimatedTotal = retrieveUserPR()['Total'].estimated1RM;
        const currentTestedTotal = retrieveUserPR()['Total'].tested1RM;

        if (brzyckiEquation(exercise.Weight, exercise.Reps) > currentEstimatedPR) {
          let estimated1RM = Math.floor(brzyckiEquation(exercise.Weight, exercise.Reps));
          updateUserPR(exercise.exerciseName, estimated1RM, 'estimated1RM');
          updateUserPR('Total', currentEstimatedTotal + estimated1RM, 'estimated1RM')
        }

        if (exercise.Weight > currentTestedPR) {
          updateUserPR(exercise.exerciseName, exercise.Weight, 'tested1RM')
          updateUserPR('Total', currentTestedTotal + exercise.Weight, 'tested1RM')
        }
      }
    }
  }

  return(
    <div>
      <h1>Total:</h1>
      <Button onClick={calculateOneRM}>Calculate 1RM</Button>
      <LogTable tableRows={tableRows}/>
    </div>
  )
}

export default Stats;

function LogTable(props) {
  return (
    <Table celled padded>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Exercise</Table.HeaderCell>
          <Table.HeaderCell>Tested 1RM</Table.HeaderCell>
          <Table.HeaderCell>Estimated 1RM</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
  
      <Table.Body>
        {props.tableRows}
      </Table.Body>
    </Table>
  )
}
  
function TableRow(props) {
  return (
    <Table.Row>
      <Table.Cell>
        <Header as='h4' textAlign='center'>{props.exerciseName}</Header>
      </Table.Cell>
      <Table.Cell textAlign='center'>{props.tested1RM}</Table.Cell>
      <Table.Cell textAlign='center'>{props.estimated1RM}</Table.Cell>
    </Table.Row>
  )
}