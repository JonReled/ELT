import React, { useState, useContext, useEffect } from 'react';
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import { Button, Dropdown, Header, Table } from 'semantic-ui-react';
import { NumericOnlyInput } from '../UtilityComponents/components.js';
import { LogStatsContext, ClickedDayContext } from '../Context.js';
import { addExerciseToDatabase, retrieveExerciseDatabase, addLogToDatabase, retrieveLogDatabase, removeLogFromDatabase } from '../DatabaseFunctions';
import '../index.css'

function Logs(props) {
  const [clickedDay, setClickedDay] = useContext(ClickedDayContext);
  const [currentTab, setcurrentTab] = useState('');

  function handleClickDay(date) {
    setClickedDay(moment(date));
    setcurrentTab('');
  }

  function changeDayBackgroundIfHasLog(date, view) {
    let dayHasLog = retrieveLogDatabase().hasOwnProperty(moment(date).format('DD MM YYYY'))
    if (view === 'month' && dayHasLog) {
      return 'dayWithLog';
    }
  }

  function changeDayBackgroundIfFuture(date, view) {
    const isInFuture = moment().isBefore(date);
    console.log(isInFuture)

    if (view === 'month' && isInFuture) {
      return 'dayInFuture';
    }
  }

  return(
    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
      <Calendar onClickDay={handleClickDay} tileClassName={({ activeStartDate, date, view }) => [changeDayBackgroundIfHasLog(date, view), changeDayBackgroundIfFuture(date, view)]} />
      <LogScreenButtons currentScreen={setcurrentTab} />
      {currentTab}
    </div>
  )
}

function LogScreenButtons(props) {
  const [clickedDay] = useContext(ClickedDayContext);
  let dayHasLog = retrieveLogDatabase().hasOwnProperty(moment(clickedDay).format('DD MM YYYY'));
  let isInFuture = moment(clickedDay).isAfter();

  if (isInFuture) {
    return <div></div>;
  } else if (!dayHasLog) {
    return (
      <div className="logScreenButtons">
        <Button className="logScreenButton" onClick={() => props.currentScreen(<LogScreenCreate />)}>Create Log</Button>
      </div>
    )
  } else if (dayHasLog) {
      return (
        <div className="logScreenButtons">
          <Button className="logScreenButton" onClick={() => props.currentScreen(<LogScreenRemove />)} currentScreen={props.currentScreen}>Remove Log</Button>
          <Button className="logScreenButton" onClick={() => props.currentScreen(<LogScreenView />)}>View log</Button>
        </div>
  )
  }
}

function LogScreenCreate(props) {
  const [exerciseToAdd, setExerciseToAdd] = useState('');
  const [currentlySelectedExercise, setCurrentlySelectedExercise] = useState('');
  const [displayedExercises, setDisplayedExercises] = useState([]);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [isDisplayed, setIsDisplayed] = useState('flex');
  const [logStats, setLogStats] = useContext(LogStatsContext);
  const [clickedDay] = useContext(ClickedDayContext);

  function addExercise() {
      setDisplayedExercises(displayedExercises.concat(exerciseToAdd));
      setExerciseIndex(exerciseIndex + 1);
      setLogStats({...logStats, [exerciseIndex]: {exerciseName: '', Sets: '', Reps: '', Weight: ''}})
  }

  useEffect(() => {
    setExerciseToAdd(<ExerciseRow exerciseName={currentlySelectedExercise} exerciseIndex={exerciseIndex} />)
  }, [currentlySelectedExercise, exerciseIndex]);

  function handleChange(exerciseName) {
    setCurrentlySelectedExercise(exerciseName)
  }

  function handleSubmit(event) {
    addLogToDatabase(logStats, moment(clickedDay).format('DD MM YYYY'));
    setIsDisplayed('none')
  }

  return (
      <div style={{display: isDisplayed, flexDirection: 'column', alignItems: 'center'}}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>{displayedExercises}</div>
          <Dropdown
            allowAdditions
            additionPosition='bottom'
            placeholder='Select Exercise'
            search
            selection
            options={retrieveExerciseDatabase()}
            onAddItem={(_, event) => addExerciseToDatabase(event.value)}
            onChange={(_, text) => handleChange(text.value)} 
          />
          <br />
          <div>
            <Button onClick={addExercise}>Add exercise</Button>
            <Button primary onClick={(event) => handleSubmit(event)}>Submit</Button>
          </div>
      </div>
  )
  
}

function LogScreenView(props) {
  const [clickedDay] = useContext(ClickedDayContext);
  const exerciseLog = retrieveLogDatabase()[moment(clickedDay).format('DD MM YYYY')];

  let exerciseRows = [];
  for (let i = 0; i < Object.keys(exerciseLog).length; i++) {
    let exercise = exerciseLog[i];
    exerciseRows.push(<TableExerciseRow exerciseName={exercise['exerciseName']} sets={exercise['Sets']} reps={exercise['Reps']} weight={exercise['Weight']} />)
  }

  return (
    <div>
      <LogTable tableExerciseRows={exerciseRows}/>
    </div>
    
  )
}

function LogScreenRemove(props) {
  const [isDisplayed, setIsDisplayed] = useState('block');
  const [clickedDay] = useContext(ClickedDayContext);

  function RemoveLogAndDiv(event) {
    removeLogFromDatabase(moment(clickedDay).format('DD MM YYYY'));
    setIsDisplayed('none');
  }

  return (
    <div style={{display: isDisplayed, textAlign: 'center'}}>
      <h2>Are you sure?</h2>
      <Button negative onClick={(event) => RemoveLogAndDiv(event)}>Delete</Button>
      <Button positive onClick={() => setIsDisplayed('none')}>Return</Button>
    </div>
  )
}

function ExerciseRow(props) {
  const [logStats] = useContext(LogStatsContext);
  logStats[props.exerciseIndex].exerciseName = props.exerciseName;
  console.log(logStats)

  function addExerciseToContext(value, placeholder) {
      logStats[props.exerciseIndex][placeholder] = value;

  }

  return(
      <div style={{marginBottom: '3px',width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'flex-start'}}>
          <p style={{margin: '5px', display: 'inline', fontSize:'1.5rem', width: '25%'}}>{props.exerciseName}:</p>
          <NumericOnlyInput placeholder='Sets' handleChange={addExerciseToContext} />
          <NumericOnlyInput placeholder='Reps' handleChange={addExerciseToContext} />
          <NumericOnlyInput placeholder='Weight' handleChange={addExerciseToContext} />
      </div>
  )
}

function LogTable(props) {
  return (
    <Table celled padded>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Exercise</Table.HeaderCell>
          <Table.HeaderCell>Sets</Table.HeaderCell>
          <Table.HeaderCell>Reps</Table.HeaderCell>
          <Table.HeaderCell>Weight</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {props.tableExerciseRows}
      </Table.Body>
    </Table>
  )
}

function TableExerciseRow(props) {
  return (
    <Table.Row>
      <Table.Cell>
        <Header as='h4' textAlign='center'>{props.exerciseName}</Header>
      </Table.Cell>
      <Table.Cell textAlign='center'>{props.sets}</Table.Cell>
      <Table.Cell textAlign='center'>{props.reps}</Table.Cell>
      <Table.Cell textAlign='center'>{props.weight}</Table.Cell>
    </Table.Row>
  )
}

export default Logs;