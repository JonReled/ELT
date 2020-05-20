import React from 'react';
import '../semantic/dist/semantic.css';
import { Checkbox, Button } from 'semantic-ui-react'
import '../index.css';

let userSettings = {
    weightUnit: 'kg',
    heightUnit: 'cm'
}

export const WeightUnitToggleSwitch = () => {
    return(
        <Checkbox toggle onChange={(event, data) => data.checked ? userSettings.weightUnit = 'lb' : userSettings.weightUnit = 'kg'} defaultChecked={localStorage.getItem('weightUnit') === 'lb'} />
    )
}

export const HeightUnitToggleSwitch = () => {
    return(
        <Checkbox toggle onChange={(event, data) => data.checked ? userSettings.heightUnit = 'ft' : userSettings.heightUnit = 'cm'} defaultChecked={localStorage.getItem('heightUnit') === 'ft'} />
    )
}

function updateSettings() {
    for (let key in userSettings) {
        localStorage.setItem(key, userSettings[key])
    }
    console.log(userSettings)
}

export const SaveSettingsButton = () => <Button onClick={updateSettings}>Save Settings</Button>
