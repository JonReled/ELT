import React from 'react';
import '../semantic/dist/semantic.css';
import '../index.css';
import { Button } from 'semantic-ui-react'

class LogsScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            logScreenTab: ''
        }
        this.handleOnClick = this.handleOnClick.bind(this);
    }

    handleOnClick(tab) {
        this.setState({
            logScreenTab: tab
        })
    }

    render() {
        let screen;
        if (this.state.logScreenTab === 'create') {
            screen = <h1>create</h1>;
        } else if (this.state.logScreenTab === 'remove') {
            screen = <h1>remove</h1>;
        } else if (this.state.logScreenTab === 'view') {
            screen = <h1>view</h1>;
        }
        return (
            <div>
                <div className="logScreenButtons">
                    <Button className="logScreenButton" onClick={() => this.handleOnClick('create')}>Create Log</Button>
                    <Button className="logScreenButton" onClick={() => this.handleOnClick('remove')}>Remove Log</Button>
                    <Button className="logScreenButton" onClick={() => this.handleOnClick('view')}>View log</Button>
                </div>
                <div>
                    {screen}
                </div>
            </div>
        )
    }
}

export default LogsScreen;