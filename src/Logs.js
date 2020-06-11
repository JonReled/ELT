import React, { useState, useContext, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import {
  Button, Dropdown, Header, Table, Icon,
} from 'semantic-ui-react';
import { NumericOnlyInput } from './components';
import { LogStatsContext, ClickedDayContext } from './Context';
import {
  addExerciseToDatabase, retrieveExerciseDatabase, addLogToDatabase, retrieveLogDatabase, removeLogFromDatabase,
} from './DatabaseFunctions';
import './index.css';

function Logs() {
  const [clickedDay, setClickedDay] = useContext(ClickedDayContext);
  const [currentTab, setcurrentTab] = useState('');

  function handleClickDay(date) {
    setClickedDay(moment(date));
    setcurrentTab('');
  }

  function changeDayBackgroundIfHasLog(date, view) {
    const dayHasLog = retrieveLogDatabase().hasOwnProperty(moment(date).format('DD MM YYYY'));
    if (view === 'month' && dayHasLog) {
      return 'dayWithLog';
    }
  }

  function changeDayBackgroundIfFuture(date, view) {
    const isInFuture = moment().isBefore(date);

    if (view === 'month' && isInFuture) {
      return 'dayInFuture';
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Calendar onClickDay={handleClickDay} tileClassName={({ activeStartDate, date, view }) => [changeDayBackgroundIfHasLog(date, view), changeDayBackgroundIfFuture(date, view)]} />
      <LogScreenButtons currentScreen={setcurrentTab} />
      {currentTab}
    </div>
  );
}

function LogScreenButtons(props) {
  const [clickedDay] = useContext(ClickedDayContext);
  const dayHasLog = retrieveLogDatabase().hasOwnProperty(moment(clickedDay).format('DD MM YYYY'));
  const isInFuture = moment(clickedDay).isAfter();

  if (isInFuture) {
    return <div />;
  } if (!dayHasLog) {
    return (
      <div className="logScreenButtons">
        <Button className="logScreenButton" onClick={() => props.currentScreen(<LogScreenCreate />)}>Create Log</Button>
      </div>
    );
  } if (dayHasLog) {
    return (
      <div className="logScreenButtons">
        <Button className="logScreenButton" onClick={() => props.currentScreen(<LogScreenRemove />)} currentScreen={props.currentScreen}>Remove Log</Button>
        <Button className="logScreenButton" onClick={() => props.currentScreen(<LogScreenView />)}>View log</Button>
      </div>
    );
  }
}

function LogScreenCreate() {
  const [exerciseToAdd, setExerciseToAdd] = useState('');
  const [currentlySelectedExercise, setCurrentlySelectedExercise] = useState('');
  const [displayedExercises, setDisplayedExercises] = useState([]);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [isDisplayed, setIsDisplayed] = useState('flex');
  const [warningMessage, setWarningMessage] = useState();
  const [logStats, setLogStats] = useContext(LogStatsContext);
  const [clickedDay] = useContext(ClickedDayContext);

  function addExercise() {
    const exercise = {
      exerciseName: currentlySelectedExercise,
      Sets: '',
      Reps: '',
      Weight: '',
    };

    setWarningMessage();
    setDisplayedExercises(displayedExercises.concat(exerciseToAdd));
    setExerciseIndex(logStats.length + 1);
    setLogStats([...logStats, exercise]);
  }

  useEffect(() => {
    setExerciseToAdd(<ExerciseRow exerciseName={currentlySelectedExercise} exerciseIndex={exerciseIndex} />);
    setExerciseIndex(logStats.length);
  }, [currentlySelectedExercise, exerciseIndex, logStats]);

  function handleChange(exerciseName) {
    setCurrentlySelectedExercise(exerciseName);
  }

  function handleSubmit(event) {
    let allInputsFilled = true;
    let allInputsNumber = true;

    for (let i = 0; i < logStats.length; i++) {
      const exercise = logStats[i];

      for (let j = 1; j < exercise.length; j++) {
        const exerciseData = exercise[j];

        if (isNaN(exerciseData[1]) || exerciseData[1] < 0) {
          allInputsNumber = false;
        } else if (!exerciseData[1]) {
          allInputsFilled = false;
        }
      }
    }

    if (logStats.length === 0) {
      setWarningMessage(<h2 style={{ color: 'red' }}>Please enter an exercise.</h2>);
    } else if (!allInputsFilled) {
      setWarningMessage(<h2 style={{ color: 'red' }}>Please fill in all input boxes.</h2>);
    } else if (!allInputsNumber) {
      setWarningMessage(<h2 style={{ color: 'red' }}>Only numeric inputs that are greater than zero are allowed.</h2>);
    } else {
      addLogToDatabase(logStats, moment(clickedDay).format('DD MM YYYY'));
      setLogStats([]);
      setIsDisplayed('none');
    }
  }

  return (
    <div style={{
      display: isDisplayed, flexDirection: 'column', alignItems: 'center', padding: '1rem',
    }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>{displayedExercises}</div>
      <Dropdown
        allowAdditions
        additionPosition="bottom"
        placeholder="Select Exercise"
        search
        selection
        options={retrieveExerciseDatabase()}
        onAddItem={(_, event) => addExerciseToDatabase(event.value)}
        onChange={(_, text) => handleChange(text.value)}
      />
      <br />
      <div style={{ margin: '3px' }}>
        <Button onClick={addExercise}>Add exercise</Button>
        <Button primary onClick={(event) => handleSubmit(event)}>Submit</Button>
      </div>
      {warningMessage}
    </div>
  );
}

function LogScreenView() {
  const [clickedDay] = useContext(ClickedDayContext);
  const exerciseLog = retrieveLogDatabase()[moment(clickedDay).format('DD MM YYYY')];

  const exerciseRows = [];
  for (let i = 0; i < exerciseLog.length; i++) {
    const exercise = exerciseLog[i];
    exerciseRows.push(<TableExerciseRow exerciseName={exercise.exerciseName} sets={exercise.Sets} reps={exercise.Reps} weight={exercise.Weight} />);
  }

  return (
    <div>
      <LogTable tableExerciseRows={exerciseRows} />
    </div>

  );
}

function LogScreenRemove() {
  const [isDisplayed, setIsDisplayed] = useState('block');
  const [clickedDay] = useContext(ClickedDayContext);

  function RemoveLogAndDiv(event) {
    removeLogFromDatabase(moment(clickedDay).format('DD MM YYYY'));
    setIsDisplayed('none');
  }

  return (
    <div style={{ display: isDisplayed, textAlign: 'center' }}>
      <h2>Are you sure?</h2>
      <Button negative onClick={(event) => RemoveLogAndDiv(event)}>Delete</Button>
      <Button positive onClick={() => setIsDisplayed('none')}>Return</Button>
    </div>
  );
}

function ExerciseRow(props) {
  const [logStats] = useContext(LogStatsContext);
  const [isDisplayed, setIsDisplayed] = useState('flex');

  function deleteExercise() {
    logStats.splice(props.exerciseIndex, 1);
    setIsDisplayed('none');
  }

  function addExerciseToContext(value, placeholder) {
    logStats[props.exerciseIndex][placeholder] = value;
  }

  return (
    <div style={{
      marginBottom: '3px', width: '100%', display: isDisplayed, flexDirection: 'row', alignItems: 'flex-start',
    }}
    >
      <p style={{
        margin: '5px', display: 'inline', fontSize: '1.5rem', width: '25%',
      }}
      >{props.exerciseName}:</p>
      <NumericOnlyInput placeholder="Sets" handleChange={addExerciseToContext} />
      <NumericOnlyInput placeholder="Reps" handleChange={addExerciseToContext} />
      <NumericOnlyInput placeholder="Weight" handleChange={addExerciseToContext} />
      <Icon onClick={deleteExercise} name="delete" style={{ position: 'relative', top: '5px', cursor: 'pointer' }} size="big" color="red" />
    </div>
  );
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
  );
}

function TableExerciseRow(props) {
  return (
    <Table.Row>
      <Table.Cell>
        <Header as="h4" textAlign="center">{props.exerciseName}</Header>
      </Table.Cell>
      <Table.Cell textAlign="center">{props.sets}</Table.Cell>
      <Table.Cell textAlign="center">{props.reps}</Table.Cell>
      <Table.Cell textAlign="center">{props.weight}</Table.Cell>
    </Table.Row>
  );
}

export default Logs;
