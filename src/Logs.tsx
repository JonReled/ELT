import React, { useState, useContext, useEffect, ReactElement } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import { Button, Dropdown, Header, Table, Icon } from 'semantic-ui-react';
import { NumericOnlyInput } from './components';
import { LogStatsContext, ClickedDayContext } from './Context';
import { addExerciseToDatabase, retrieveExerciseDatabase, addLogToDatabase, retrieveLogDatabase, removeLogFromDatabase } from './Database';
import './index.css';

function Logs(): ReactElement {
  const clickedDay = useContext(ClickedDayContext);
  const [currentTab, setcurrentTab] = useState(<div />);

  function handleClickDay(date: Date) {
    clickedDay.setDate(moment(date));
    setcurrentTab(<div />);
  }

  function changeDayBackgroundIfHasLog(date: Date, view: string): string | null {
    const dayHasLog = Object.prototype.hasOwnProperty.call(retrieveLogDatabase(), moment(date).format('DD MM YYYY'));
    return view === 'month' && dayHasLog ? 'dayWithLog' : null;
  }

  function changeDayBackgroundIfFuture(date: string, view: string): string | null {
    const isInFuture = moment().isBefore(date);
    return view === 'month' && isInFuture ? 'dayInFuture' : null;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Calendar onClickDay={handleClickDay} tileClassName={({ date, view }) => [changeDayBackgroundIfHasLog(date, view), changeDayBackgroundIfFuture(date, view)]} />
      <LogScreenButtons currentScreen={setcurrentTab} />
      {currentTab}
    </div>
  );
}

function LogScreenButtons(props: {currentScreen: React.Dispatch<React.SetStateAction<JSX.Element>>}): ReactElement {
  const { currentScreen } = props;
  const clickedDay = useContext(ClickedDayContext);
  const dayHasLog = Object.prototype.hasOwnProperty.call(retrieveLogDatabase(), moment(clickedDay.date).format('DD MM YYYY'))
  const isInFuture = moment(clickedDay.date).isAfter();
  
  if (isInFuture) {
    return <div />;
  }
  return (
      <div className="logScreenButtons">
        <Button className="logScreenButton" onClick={() => currentScreen(<LogScreenCreate />)} style={{display: dayHasLog ? 'none' : 'block'}} >
          Create Log
        </Button>
        <Button className="logScreenButton" onClick={() => currentScreen(<LogScreenRemove />)} style={{display: dayHasLog ? 'block' : 'none'}} >
          Remove Log
        </Button>
        <Button className="logScreenButton" onClick={() => currentScreen(<LogScreenView />)} style={{display: dayHasLog ? 'block' : 'none'}} >
          View log
        </Button>     
      </div>
    );
  }

function LogScreenCreate(): ReactElement {
  const [exerciseToAdd, setExerciseToAdd] = useState<ReactElement>(<div />);
  const [currentlySelectedExercise, setCurrentlySelectedExercise] = useState<string>('');
  const [displayedExercises, setDisplayedExercises] = useState<any[]>([]);
  const [exerciseIndex, setExerciseIndex] = useState<number>(0);
  const [isDisplayed, setIsDisplayed] = useState<string>('flex');
  const [warningMessage, setWarningMessage] = useState<ReactElement>(<div />);
  const log = useContext(LogStatsContext);
  const clickedDay = useContext(ClickedDayContext);

  function addExercise() {
    const exercise = {
      exerciseName: currentlySelectedExercise,
      Sets: '',
      Reps: '',
      Weight: '',
    };

    setWarningMessage(<div />);
    setDisplayedExercises([...displayedExercises, exerciseToAdd]);
    setExerciseIndex(log.stats.length + 1);
    log.setStats([...log.stats, exercise]);
  }

  useEffect(() => {
    setExerciseToAdd(<ExerciseRow exerciseName={currentlySelectedExercise} exerciseIndex={exerciseIndex} />);
    setExerciseIndex(log.stats.length);
  }, [currentlySelectedExercise, exerciseIndex, log.stats]);

  function handleChange(exerciseName: string): void {
    setCurrentlySelectedExercise(exerciseName);
  }

  function handleSubmit() {
    let allInputsFilled = true;
    let allInputsNumber = true;

    for (let i = 0; i < log.stats.length; i++) {
      const exercise: any[] = log.stats[i];

      for (let j = 1; j < Object.keys(exercise).length; j++) {
        const exerciseData: number | string = Object.values(exercise)[j];
        console.log(Object.values(exercise));

        if (exerciseData === '') {
          allInputsFilled = false;
        } else if ( isNaN(exerciseData as number) || exerciseData < 0) {
          allInputsNumber = false;
        }
      }
    }

    if (log.stats.length === 0) {
      setWarningMessage(<h2 style={{ color: 'red' }}>Please enter an exercise.</h2>);
    } else if (!allInputsFilled) {
      setWarningMessage(<h2 style={{ color: 'red' }}>Please fill in all input boxes.</h2>);
    } else if (!allInputsNumber) {
      setWarningMessage(<h2 style={{ color: 'red' }}>Only numeric inputs that are greater than zero are allowed.</h2>);
    } else {
      addLogToDatabase(log.stats, moment(clickedDay.date).format('DD MM YYYY'));
      log.setStats([]);
      setIsDisplayed('none');
    }
  }

  return (
    <div
      style={{
        display: isDisplayed,
        flexDirection: 'column',
        alignItems: 'center',
        padding: '1rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {displayedExercises}
      </div>
      <Dropdown
        allowAdditions
        additionPosition="bottom"
        placeholder="Select Exercise"
        search
        selection
        options={retrieveExerciseDatabase()}
        onAddItem={(_, event) => addExerciseToDatabase(event.value as string)}
        onChange={(_, text) => handleChange(text.value as string)}
      />
      <br />
      <div style={{ margin: '3px' }}>
        <Button onClick={addExercise}>Add exercise</Button>
        <Button primary onClick={handleSubmit}>
          Submit
        </Button>
      </div>
      {warningMessage}
    </div>
  );
}

function LogScreenView(): ReactElement {
  const clickedDay = useContext(ClickedDayContext);
  const exerciseLog = retrieveLogDatabase()[moment(clickedDay.date).format('DD MM YYYY')];

  const exerciseRows: any[] = [];
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

function LogScreenRemove(): ReactElement {
  const [isDisplayed, setIsDisplayed] = useState('block');
  const clickedDay = useContext(ClickedDayContext);

  function removeLogAndDiv() {
    removeLogFromDatabase(moment(clickedDay.date).format('DD MM YYYY'));
    setIsDisplayed('none');
  }

  return (
    <div style={{ display: isDisplayed, textAlign: 'center' }}>
      <h2>Are you sure?</h2>
      <Button negative onClick={removeLogAndDiv}>
        Delete
      </Button>
      <Button positive onClick={() => setIsDisplayed('none')}>
        Return
      </Button>
    </div>
  );
}

function ExerciseRow(props): ReactElement {
  const log = useContext(LogStatsContext);
  const [isDisplayed, setIsDisplayed] = useState('flex');
  const { exerciseName } = props;

  function deleteExercise() {
    log.stats.splice(props.exerciseIndex, 1);
    setIsDisplayed('none');
  }

  function addExerciseToContext(value, placeholder) {
    log.stats[props.exerciseIndex][placeholder] = value;
  }

  return (
    <div style={{ marginBottom: '3px', width: '100%', display: isDisplayed, flexDirection: 'row', alignItems: 'flex-start',}}>
      <p style={{ margin: '5px', display: 'inline', fontSize: '1.5rem', width: '25%',}}>
        {exerciseName}:
      </p>
      <NumericOnlyInput placeholder="Sets" handleChange={addExerciseToContext} />
      <NumericOnlyInput placeholder="Reps" handleChange={addExerciseToContext} />
      <NumericOnlyInput placeholder="Weight" handleChange={addExerciseToContext} />
      <Icon onClick={deleteExercise} name="delete" style={{ position: 'relative', top: '5px', cursor: 'pointer' }} size="big" color="red" />
    </div>
  );
}

function LogTable(props): ReactElement {
  const { tableExerciseRows } = props;

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

      <Table.Body>{tableExerciseRows}</Table.Body>
    </Table>
  );
}

function TableExerciseRow({ exerciseName, sets, reps, weight }: {exerciseName: string, sets: number, reps: number, weight: number}): ReactElement {

  return (
    <Table.Row>
      <Table.Cell>
        <Header as="h4" textAlign="center">
          {exerciseName}
        </Header>
      </Table.Cell>
      <Table.Cell textAlign="center">{sets}</Table.Cell>
      <Table.Cell textAlign="center">{reps}</Table.Cell>
      <Table.Cell textAlign="center">{weight}</Table.Cell>
    </Table.Row>
  );
}

export default Logs;