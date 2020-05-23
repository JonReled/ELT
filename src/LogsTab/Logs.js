import React, { useState } from 'react';
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import {LogScreenButtons, LogScreenCreate, LogScreenRemove, LogScreenView} from './LogsFunctionality.js';

function Logs(props) {
  const [currentDay, setcurrentDay] = useState(moment(new Date()).format('DD-MM-YYYY'));
  const [currentTab, setcurrentTab] = useState('');

  function handleClickDay(value) {
    setcurrentDay(moment(value).format('DD-MM-YYYY'))
  }

  return(
    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
      <Calendar onClickDay={handleClickDay} />
      <LogScreenButtons currentScreen={setcurrentTab} />
      {currentTab}
    </div>
  )
}


export default Logs;
