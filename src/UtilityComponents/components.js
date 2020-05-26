import React, { useState } from 'react';
import '../index.css';
import { Input } from 'semantic-ui-react'

export function NumericOnlyInput(props) {
    const [error, setError] = useState(false);

    function updateAndCheckIfNumber(userInput) {
        setError(isNaN(userInput))
        props.handleChange(parseInt(userInput), props.placeholder);
    }

    return(
        <Input error={error} onChange={(event, data) => updateAndCheckIfNumber(data.value)} placeholder={props.placeholder} />
    )
}
