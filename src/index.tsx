import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './semantic/dist/semantic.css';
import Website from './App';
import * as serviceWorker from './serviceWorker';
import { LogStatsContext, StandardTypeContext, NewProgramContext, WeightUnitContext } from './Context';

function App() {
  const [stats, setStats] = useState([]);
  const [value, set] = useState('Estimated Level');
  const [program, setProgram] = useState([]);
  const [weightUnit, setWeightUnit] = useState<string>('kg');

  return (
    <LogStatsContext.Provider value={{ stats, setStats }}>
      <StandardTypeContext.Provider value={{ value, set }}>
        <NewProgramContext.Provider value={{ program, setProgram }}>
          <WeightUnitContext.Provider value={{ weightUnit, setWeightUnit }}>
            <Website />
          </WeightUnitContext.Provider>
        </NewProgramContext.Provider>
      </StandardTypeContext.Provider>
    </LogStatsContext.Provider>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
