import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './semantic/dist/semantic.css';
import TabExampleSecondaryPointing from './App';
import * as serviceWorker from './serviceWorker';
import { LogStatsContext, ClickedDayContext, StandardTypeContext, NewProgramContext } from './Context';

function App() {
  const [stats, setStats] = useState([]);
  const [date, setDate] = useState(new Date());
  const [type, setType] = useState('Estimated Level');
  const [program, setProgram] = useState([]);

  return (
    <LogStatsContext.Provider value={{ stats, setStats }}>
      <ClickedDayContext.Provider value={{ date, setDate }}>
        <StandardTypeContext.Provider value={{ type, setType }}>
          <NewProgramContext.Provider value={{ program, setProgram }}>
            <TabExampleSecondaryPointing />
          </NewProgramContext.Provider>
        </StandardTypeContext.Provider>
      </ClickedDayContext.Provider>
    </LogStatsContext.Provider>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
