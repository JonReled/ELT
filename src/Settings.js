import React from 'react';
import { Checkbox } from 'semantic-ui-react';
import { retrieveUserSettingsDatabase, updateUserSettingsDatabase} from './DatabaseFunctions';

export function Settings() {
    return(
        <div>
            <div className="setting">
                <span className="settingLabel">Kg</span><WeightUnitToggleSwitch /><span className="settingLabel">Lb</span>
            </div>
            <div className="setting">
                <span className="settingLabel">Cm</span><HeightUnitToggleSwitch /><span className="settingLabel">Ft</span>
            </div>
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