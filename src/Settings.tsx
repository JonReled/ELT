import React, { ReactElement } from 'react';
import { Checkbox, Label } from 'semantic-ui-react';
import { retrieveUserSettingsDatabase, updateUserSettingsDatabase } from './Database';

function Settings(): ReactElement {
  return (
    <div>
      <div className="setting">
        <CustomLabel direction="right" content="Kg" />
        <WeightUnitToggleSwitch />
        <CustomLabel direction="left" content="Lb" />
      </div>
      <div className="setting">
        <CustomLabel direction="right" content="Cm" />
        <HeightUnitToggleSwitch />
        <CustomLabel direction="left" content="Ft" />
      </div>
    </div>
  );
}

function WeightUnitToggleSwitch() {
  return (
    <Checkbox
      toggle
      onChange={(event, data) => {
        if (data.checked) {
          updateUserSettingsDatabase('weightUnit', 'lb');
        } else {
          updateUserSettingsDatabase('weightUnit', 'kg');
        }
      }}
      defaultChecked={retrieveUserSettingsDatabase('weightUnit') === 'lb'}
    />
  );
}

function HeightUnitToggleSwitch() {
  return (
    <Checkbox
      toggle
      onChange={(event, data) => {
        if (data.checked) {
          updateUserSettingsDatabase('heightUnit', 'ft');
        } else {
          updateUserSettingsDatabase('heightUnit', 'cm');
        }
      }}
      defaultChecked={retrieveUserSettingsDatabase('heightUnit') === 'ft'}
    />
  );
}

interface CustomLabelProps {
  direction: 'right' | 'left';
  content: string;
}

function CustomLabel(props: CustomLabelProps): ReactElement {
  const { direction, content } = props;

  return (
    <Label className="settingLabel" pointing={direction}>
      {content}
    </Label>
  );
}

export default Settings;
