import React from 'react';
import { Checkbox } from 'semantic-ui-react';
import { retrieveUserSettingsDatabase, updateUserSettingsDatabase } from '../DatabaseFunctions';


const defaultExerciseDatabase = [{value: 'Bench', text: 'Bench'}, {value: 'Deadlift', text: 'Deadlift'}, {value: 'Squat', text: 'Squat'}];
const defaultLogDatabase = {};
const defaultUserSettings = {
    weightUnit: 'kg',
    heightUnit: 'cm'
}
export const defaultUserPRs = {
    Bench: {tested1RM: 0, estimated1RM: 0},
    Deadlift: {tested1RM: 0, estimated1RM: 0},
    Squat: {tested1RM: 0, estimated1RM: 0},
    Total: {tested1RM: 0, estimated1RM: 0}
}

export function Settings() {
    return(
        <div>
            <div className="setting">
                <span className="settingLabel">Kg</span><WeightUnitToggleSwitch /><span className="settingLabel">Lb</span>
            </div>
            <div className="setting">
                <span className="settingLabel">Cm</span><HeightUnitToggleSwitch /><span className="settingLabel">Ft</span>
            </div>
                <button onClick={() => localStorage.setItem('exerciseDatabase', JSON.stringify(defaultExerciseDatabase))}>pls</button>
                <button onClick={() => localStorage.setItem('logDatabase', JSON.stringify(defaultLogDatabase))}>yes</button>
                <button onClick={() => localStorage.setItem('userSettings', JSON.stringify(defaultUserSettings))}>noo</button>
                <button onClick={() => localStorage.setItem('userPRs', JSON.stringify(defaultUserPRs))}>rwrwrw</button>
        </div>
    )
}

function WeightUnitToggleSwitch() {
    return(
        <Checkbox toggle onChange={(event, data) => data.checked ? updateUserSettingsDatabase('weightUnit', 'lb') : updateUserSettingsDatabase('weightUnit', 'kg')} defaultChecked={retrieveUserSettingsDatabase('weightUnit') === 'lb'} />
    )
}

function HeightUnitToggleSwitch() {
    return(
        <Checkbox toggle onChange={(event, data) => data.checked ? updateUserSettingsDatabase('heightUnit', 'ft') : updateUserSettingsDatabase('heightUnit', 'cm')} defaultChecked={retrieveUserSettingsDatabase('heightUnit') === 'ft'} />
    )
}