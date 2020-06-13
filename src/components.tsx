import React, { useState } from 'react';
import { Input } from 'semantic-ui-react'

interface NumericOnlyInputProps {
    placeholder: string;
    handleChange(userInput: string, placeholder: string): any;
}

export function NumericOnlyInput(props: NumericOnlyInputProps) {
    const [error, setError] = useState(false);

    function updateAndCheckIfNumber(userInput: string) {
        
    userInput.match(/^[0-9]+$/) !== null ? setError(true) : setError(false);
        props.handleChange(userInput, props.placeholder);

    }

    return(
        <Input style={{marginRight: '5px'}} error={error} onChange={(event, data) => updateAndCheckIfNumber(data.value)} placeholder={props.placeholder} />
    )
}
