import React, { useState } from 'react';
import { Input } from 'semantic-ui-react'

export function NumericOnlyInput(props) {
    const [error, setError] = useState(false);

    function updateAndCheckIfNumber(userInput) {
        setError(isNaN(userInput) || userInput <= 0)
        props.handleChange(parseInt(userInput), props.placeholder);
    }

    return(
        <Input style={{marginRight: '5px'}} error={error} onChange={(event, data) => updateAndCheckIfNumber(data.value)} placeholder={props.placeholder} />
    )
}
