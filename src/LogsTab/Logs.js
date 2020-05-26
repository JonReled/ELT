import React, { useState, useContext } from 'react';
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import { Button, Dropdown } from 'semantic-ui-react';
import { NumericOnlyInput } from '../UtilityComponents/components.js';
import LogStatsContext from '../Context.js';
import { addExerciseToDatabase, retrieveExerciseDatabase, addLogToDatabase } from '../DatabaseFunctions';

function Logs(props) {
  const [currentDay, setcurrentDay] = useState(moment());
  const [currentTab, setcurrentTab] = useState('');

  function handleClickDay(value) {
    setcurrentDay(moment(value))
  }

  return(
    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
      <Calendar onClickDay={handleClickDay} />
      <LogScreenButtons currentScreen={setcurrentTab} />
      {currentTab}
    </div>
  )
}

function LogScreenButtons(props) {

  return (
      <div>
          <div className="logScreenButtons">
              <Button className="logScreenButton" onClick={() => props.currentScreen(<LogScreenCreate />)}>Create Log</Button>
              <Button className="logScreenButton" onClick={() => props.currentScreen(<LogScreenRemove />)}>Remove Log</Button>
              <Button className="logScreenButton" onClick={() => props.currentScreen(<LogScreenView />)}>View log</Button>
          </div>
      </div>
  )
}

function LogScreenCreate(props) {
  const [exerciseToAdd, setExerciseToAdd] = useState('');
  const [displayedExercises, setDisplayedExercises] = useState([]);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [logStats, setLogStats] = useContext(LogStatsContext);

  function addExercise() {
      setDisplayedExercises(displayedExercises.concat(exerciseToAdd));
      setExerciseIndex(exerciseIndex + 1);
  }

  function handleChange(exerciseName) {
      setExerciseToAdd(<ExerciseRow exerciseName={exerciseName} exerciseIndex={exerciseIndex} />)
  }

  return (
      <div>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>{displayedExercises}</div>
          <Dropdown
              allowAdditions
              additionPosition='bottom'
              placeholder='Select Exercise'
              fluid
              search
              selection
              options={retrieveExerciseDatabase()}
              onAddItem={(_, event) => addExerciseToDatabase(event.value)}
              onChange={(_, text) => handleChange(text.value)} 
          />
          <Button onClick={addExercise}>Add exercise</Button>
          <Button primary onClick={() => addLogToDatabase(logStats)}>Submit</Button>
      </div>
  )
  
}

function LogScreenRemove(props) {
  return (
      <h1>remove {props.currentDay}</h1>
  )
}

function LogScreenView(props) {
  return (
      <h1>view {props.currentDay}</h1>
  )
}

function ExerciseRow(props) {
  const [logStats, setLogStats] = useContext(LogStatsContext);

  function addExerciseToContext(value, placeholder) {
      let currentExercise = logStats[props.exerciseIndex]
      setLogStats({...logStats, [props.exerciseIndex]: {exerciseName: props.exerciseName, [placeholder]: value, ...currentExercise}})
  }

  return(
      <div style={{marginBottom: '3px'}}>
          <p style={{margin: '5px', display: 'inline', fontSize:'1.5rem'}}>{props.exerciseName}:</p>
          <NumericOnlyInput placeholder='Sets' handleChange={addExerciseToContext} />
          <NumericOnlyInput placeholder='Reps' handleChange={addExerciseToContext} />
          <NumericOnlyInput placeholder='Weight' handleChange={addExerciseToContext} />
      </div>
  )
}

export default Logs;