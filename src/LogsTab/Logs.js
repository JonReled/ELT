import React from 'react';
import '../semantic/dist/semantic.css';
import '../index.css';
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import LogsScreenButtons from './LogsFunctionality.js';

class Logs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDay: 'a'
    }

    this.handleClickDay = this.handleClickDay.bind(this);
  }

  handleClickDay(value) {
    this.setState({
      currentDay: moment(value).format('DD-MM-YYYY')
    })
    console.log(this.state.currentDay)
  }

  render() {
    return(
      <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
        <Calendar onClickDay={value => this.handleClickDay(value)} />
        <LogsScreenButtons />
      </div>
    )
  }
}

export default Logs;
