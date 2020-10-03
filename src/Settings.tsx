import React, { ReactElement } from 'react';
import { Checkbox, Label } from 'semantic-ui-react';
import { retrieveUserSettings, updateUserSettings } from './Database';

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
          updateUserSettings('weightUnit', 'lb');
        } else {
          updateUserSettings('weightUnit', 'kg');
        }
      }}
      defaultChecked={retrieveUserSettings('weightUnit') === 'lb'}
    />
  );
}

function HeightUnitToggleSwitch() {
  return (
    <Checkbox
      toggle
      onChange={(event, data) => {
        if (data.checked) {
          updateUserSettings('heightUnit', 'ft');
        } else {
          updateUserSettings('heightUnit', 'cm');
        }
      }}
      defaultChecked={retrieveUserSettings('heightUnit') === 'ft'}
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
