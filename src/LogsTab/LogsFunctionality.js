import React, { useState } from 'react';
import { Button, Dropdown } from 'semantic-ui-react'
import { NumericOnlyInput } from '../UtilityComponents/components.js'


export function LogScreenButtons(props) {

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
    const [exerciseDatabase, setExerciseDatabase] = useState([
        {value: 'Bench', text: 'Bench'},
        {value: 'Deadlift', text: 'Deadlift'},
        {value: 'Squat', text: 'Squat'}
    ]);
    const [currentExercise, setCurrentExercise] = useState('');
    const [displayedExercises, setDisplayedExercises] = useState([]);

    function addExercise() {
        setDisplayedExercises(displayedExercises.concat(currentExercise))
    }

    function addExerciseToDatabase(exerciseName) {
        setExerciseDatabase([...exerciseDatabase, {value: exerciseName, text: exerciseName}])
    }

    function receivePropsFromChild() {

    }

    function handleChange(exerciseName) {
        setCurrentExercise(<ExerciseRow exerciseName={exerciseName} sendPropsToParent={receivePropsFromChild}/>)
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
                options={exerciseDatabase}
                onAddItem={(_, event) => addExerciseToDatabase(event.value)}
                onChange={(_, text) => handleChange(text.value)} 
            />
            <Button onClick={addExercise}>Add exercise</Button>
            <Button  primary>Submit</Button>
        </div>
    )
    
}

export function LogScreenRemove(props) {
    return (
        <h1>remove {props.currentDay}</h1>
    )
}

export function LogScreenView(props) {
    return (
        <h1>view {props.currentDay}</h1>
    )
}

export function ExerciseRow(props) {

    function receivePropsFromChild(value, placeholder) {
        props.sendPropsToParent(value, placeholder);
    }

    return(
        <div style={{marginBottom: '3px'}}>
            <p style={{margin: '5px', display: 'inline', fontSize:'1.5rem'}}>{props.exerciseName}:</p>
            <NumericOnlyInput placeholder='Sets' sendPropsToParent={receivePropsFromChild} />
            <NumericOnlyInput placeholder='Reps' sendPropsToParent={receivePropsFromChild} />
            <NumericOnlyInput placeholder='Weight' sendPropsToParent={receivePropsFromChild} />
        </div>
    )
}