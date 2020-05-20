import React from 'react';
import '../semantic/dist/semantic.css';
import {WeightUnitToggleSwitch, HeightUnitToggleSwitch, SaveSettingsButton} from './SettingFunctionality.js';
import '../index.css';

const Settings = () => {
    return(
        <div>
            <div className="setting">
                <span className="settingLabel">Kg</span><WeightUnitToggleSwitch /><span className="settingLabel">Lb</span>
            </div>
            <div className="setting">
                <span className="settingLabel">Cm</span><HeightUnitToggleSwitch /><span className="settingLabel">Ft</span>
            </div>
            <SaveSettingsButton />
        </div>
    )
}

export default Settings;