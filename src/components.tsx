import React, { useState, ReactElement } from 'react';
import { Form } from 'semantic-ui-react';

interface NumericOnlyInputProps {
  placeholder: string;
  defaultValue: string;
  handleChange: (arg0: number, arg1: string) => void;
}

export function NumericOnlyInput({ placeholder, defaultValue, handleChange }: NumericOnlyInputProps): ReactElement {
  const [error, setError] = useState(false);

  function updateAndCheckIfNumber(userInput: string) {
    setError(Number.isNaN(parseInt(userInput, 10)));
    handleChange(parseInt(userInput, 10), placeholder);
  }

  return (
    <Form.Input style={{ marginRight: '5px' }} defaultValue={defaultValue} error={error} onChange={(event, data) => updateAndCheckIfNumber(data.value)} placeholder={placeholder} />
  );
}

export default NumericOnlyInput;
