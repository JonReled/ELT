import React, { useState, ReactElement } from 'react';
import { Input } from 'semantic-ui-react';

interface NumericOnlyInputProps {
  placeholder: string;
  defaultValue: string;
  handleChange(userInput: number, placeholder: string): void;
}

export function NumericOnlyInput({ placeholder, defaultValue, handleChange }: NumericOnlyInputProps): ReactElement {
  const [error, setError] = useState(false);

  function updateAndCheckIfNumber(userInput: string) {
    if (userInput.match(/^[0-9]+$/) === null) {
      setError(true);
    } else {
      setError(false);
    }

    handleChange(parseInt(userInput, 10), placeholder);
  }

  return (
    <Input style={{ marginRight: '5px' }} defaultValue={defaultValue} error={error} onChange={(event, data) => updateAndCheckIfNumber(data.value)} placeholder={placeholder} />
  );
}

export default NumericOnlyInput;
