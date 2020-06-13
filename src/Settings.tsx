import React from 'react';
import { Checkbox, Label } from 'semantic-ui-react';
import { retrieveUserSettingsDatabase, updateUserSettingsDatabase} from './DatabaseFunctions';

export function Settings() {
    return(
        <div>
            <div className="setting">
                <CustomLabel direction={"right"} content={"Kg"}/><WeightUnitToggleSwitch /><CustomLabel direction={"left"} content={"Lb"}/>
            </div>
            <div className="setting">
                <CustomLabel direction={"right"} content={"Cm"}/><HeightUnitToggleSwitch /><CustomLabel direction={"left"} content={"Ft"}/>
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

interface CustomLabelProps {
    direction: "right" | "left";
    content: string;
}

function CustomLabel(props: CustomLabelProps) {
    return(
        <Label className="settingLabel" pointing={props.direction}>{props.content}</Label>
    )
}