import React from 'react';
import '../semantic/dist/semantic.css';

class Stats extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return(
            <div>
                <h1>Bench:</h1>
                <h1>Squat:</h1>
                <h1>Deadlift:</h1>
                <h1>Total:</h1>
            </div>
        )
    }
}

export default Stats;
