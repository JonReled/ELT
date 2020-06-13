"use strict";
exports.__esModule = true;
var semantic_ui_react_1 = require("semantic-ui-react");
var DatabaseFunctions_1 = require("./DatabaseFunctions");
function Settings() {
    return (<div>
            <div className="setting">
                <CustomLabel direction={"right"} content={"Kg"}/><WeightUnitToggleSwitch /><CustomLabel direction={"left"} content={"Lb"}/>
            </div>
            <div className="setting">
                <CustomLabel direction={"right"} content={"Cm"}/><HeightUnitToggleSwitch /><CustomLabel direction={"left"} content={"Ft"}/>
            </div>
        </div>);
}
exports.Settings = Settings;
function WeightUnitToggleSwitch() {
    return (<semantic_ui_react_1.Checkbox toggle onChange={function (event, data) { return data.checked ? DatabaseFunctions_1.updateUserSettingsDatabase('weightUnit', 'lb') : DatabaseFunctions_1.updateUserSettingsDatabase('weightUnit', 'kg'); }} defaultChecked={DatabaseFunctions_1.retrieveUserSettingsDatabase('weightUnit') === 'lb'}/>);
}
function HeightUnitToggleSwitch() {
    return (<semantic_ui_react_1.Checkbox toggle onChange={function (event, data) { return data.checked ? DatabaseFunctions_1.updateUserSettingsDatabase('heightUnit', 'ft') : DatabaseFunctions_1.updateUserSettingsDatabase('heightUnit', 'cm'); }} defaultChecked={DatabaseFunctions_1.retrieveUserSettingsDatabase('heightUnit') === 'ft'}/>);
}
function CustomLabel(props) {
    return (<semantic_ui_react_1.Label className="settingLabel" pointing={props.direction}>{props.content}</semantic_ui_react_1.Label>);
}
