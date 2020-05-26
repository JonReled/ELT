import React from 'react';
import {WeightUnitToggleSwitch, HeightUnitToggleSwitch, SaveSettingsButton} from './SettingFunctionality.js';

const defaultExerciseDatabase = [{value: 'Bench', text: 'Bench'}, {value: 'Deadlift', text: 'Deadlift'}, {value: 'Squat', text: 'Squat'}];
const defaultLogDatabase = [];

function Settings() {
    return(
        <div>
            <div className="setting">
                <span className="settingLabel">Kg</span><WeightUnitToggleSwitch /><span className="settingLabel">Lb</span>
            </div>
            <div className="setting">
                <span className="settingLabel">Cm</span><HeightUnitToggleSwitch /><span className="settingLabel">Ft</span>
            </div>
                <button onClick={localStorage.setItem('exerciseDatabase', JSON.stringify(defaultExerciseDatabase))}>pls</button>
                <button onClick={localStorage.setItem('logDatabase', JSON.stringify(defaultLogDatabase))}>yes</button>
            <SaveSettingsButton />
        </div>
    )
}

export default Settings;