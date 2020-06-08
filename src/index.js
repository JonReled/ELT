import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './semantic/dist/semantic.css';
import TabExampleSecondaryPointing from './App';
import * as serviceWorker from './serviceWorker';
import { LogStatsContext, ClickedDayContext, StandardTypeContext } from './Context.js';
import { setUpDatabase } from './DatabaseFunctions'


function App() {
  setUpDatabase();
  const LogStatsHook = useState({});
  const ClickedDayHook = useState(new Date());
  const StandardTypeHook = useState('Estimated Level');

  return(
    <LogStatsContext.Provider value={LogStatsHook}>
      <ClickedDayContext.Provider value={ClickedDayHook}>
        <StandardTypeContext.Provider value={StandardTypeHook}>
          <TabExampleSecondaryPointing />
        </StandardTypeContext.Provider>
      </ClickedDayContext.Provider>
    </LogStatsContext.Provider>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
