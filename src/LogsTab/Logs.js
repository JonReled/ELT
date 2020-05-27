import React, { useState, useContext } from 'react';
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import { Button, Dropdown } from 'semantic-ui-react';
import { NumericOnlyInput } from '../UtilityComponents/components.js';
import { LogStatsContext } from '../Context.js';
import { addExerciseToDatabase, retrieveExerciseDatabase, addLogToDatabase, retrieveLogDatabase, removeLogFromDatabase } from '../DatabaseFunctions';
import '../index.css'

function Logs(props) {
  const [currentDay, setcurrentDay] = useState(new Date());
  const [currentTab, setcurrentTab] = useState('');
  let logDatabase = retrieveLogDatabase()
  console.log(logDatabase)

  function handleClickDay(date) {
    setcurrentDay(moment(date));
    setcurrentTab('');
  }

  function changeDayBackgroundIfHasLog(date, view) {
    let dayHasLog = retrieveLogDatabase().hasOwnProperty(moment(date).format('DD MM YYYY'))
    if (view === 'month' && dayHasLog) {
      return 'please'
    }
  }

  return(
    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
      <Calendar onClickDay={handleClickDay} tileClassName={({ activeStartDate, date, view }) => changeDayBackgroundIfHasLog(date, view)} />
      <LogScreenButtons currentDay={moment(currentDay).format('DD MM YYYY')} currentScreen={setcurrentTab} />
      {currentTab}
    </div>
  )
}

function LogScreenButtons(props) {
  let dayHasLog = retrieveLogDatabase().hasOwnProperty(props.currentDay)
  
  if (!dayHasLog) {
    return (
      <div className="logScreenButtons">
        <Button className="logScreenButton" onClick={() => props.currentScreen(<LogScreenCreate currentDay={props.currentDay} />)}>Create Log</Button>
      </div>
    )
  } else if (dayHasLog) {
      return (
        <div className="logScreenButtons">
          <Button className="logScreenButton" onClick={() => removeLogFromDatabase(props.currentDay)}>Remove Log</Button>
          <Button className="logScreenButton" onClick={() => props.currentScreen(<LogScreenView currentDay={props.currentDay} />)}>View log</Button>
        </div>
  )
  }
}

function LogScreenCreate(props) {
  const [exerciseToAdd, setExerciseToAdd] = useState('');
  const [displayedExercises, setDisplayedExercises] = useState([]);
  const [exerciseIndex, setExerciseIndex] = useState(1);
  const [logStats, setLogStats] = useContext(LogStatsContext);

  function addExercise() {
      setDisplayedExercises(displayedExercises.concat(exerciseToAdd));
      setExerciseIndex(exerciseIndex + 1);
  }

  function handleChange(exerciseName) {
      setExerciseToAdd(<ExerciseRow exerciseName={exerciseName} exerciseIndex={exerciseIndex} />)
  }

  return (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
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
            <Button primary onClick={() => addLogToDatabase(logStats, props.currentDay)}>Submit</Button>
          </div>
      </div>
  )
  
}

function LogScreenView(props) {
  const exerciseLog = retrieveLogDatabase()[props.currentDay];
  console.log(exerciseLog)
  let display = [];
  for (let i = 1; i <= Object.keys(exerciseLog).length; i++) {
    let exercise = exerciseLog[i];
    display.push(<h1>{exercise['exerciseName']}{exercise['Sets']}{exercise['Reps']}{exercise['Weight']}</h1>)
  }
  return (
    <div>{display}</div>
  )
}

function ExerciseRow(props) {
  const [logStats, setLogStats] = useContext(LogStatsContext);

  function addExerciseToContext(value, placeholder) {
      let currentExercise = logStats[props.exerciseIndex]
      setLogStats({...logStats, [props.exerciseIndex]: {exerciseName: props.exerciseName, [placeholder]: value, ...currentExercise}})
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

export default Logs;