import React from 'react';
import { Checkbox, Button } from 'semantic-ui-react'

let userSettings = {
    weightUnit: 'kg',
    heightUnit: 'cm'
}

export function WeightUnitToggleSwitch() {
    return(
        <Checkbox toggle onChange={(event, data) => data.checked ? userSettings.weightUnit = 'lb' : userSettings.weightUnit = 'kg'} defaultChecked={localStorage.getItem('weightUnit') === 'lb'} />
    )
}

export function HeightUnitToggleSwitch() {
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
