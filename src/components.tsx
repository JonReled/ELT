import React, { useState, ReactElement } from 'react';
import { Input } from 'semantic-ui-react';

interface NumericOnlyInputProps {
  placeholder: string;
  handleChange(userInput: number, placeholder: string): void;
}

export function NumericOnlyInput(props: NumericOnlyInputProps): ReactElement {
  const [error, setError] = useState(false);
  const { placeholder } = props;

  function updateAndCheckIfNumber(userInput: string) {
    if (userInput.match(/^[0-9]+$/) === null) {
      setError(true);
    } else {
      setError(false);
    }

    props.handleChange(parseInt(userInput, 10), props.placeholder);
  }

  return <Input style={{ marginRight: '5px' }} error={error} onChange={(event, data) => updateAndCheckIfNumber(data.value)} placeholder={placeholder} />;
}

export default NumericOnlyInput;
