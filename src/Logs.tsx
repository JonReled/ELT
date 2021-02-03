import React, { useState, useContext, ReactElement, useEffect } from 'react';
import { Link, Route, Switch, useHistory, useParams } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import { v4 as uuid } from 'uuid';
import { LogInterface, ExercisesInterface } from 'types';
import { Button, Dropdown, Header, Table, Icon, Form, Input, Message } from 'semantic-ui-react';
import { LogStatsContext, WeightUnitContext } from './Context';
import { createExercise, retrieveExercise, addLog, removeLog, getDates, getWorkoutLog } from './Database';
import './index.css';

function Logs(): ReactElement {
  const history = useHistory();
  const [clickedDate, setClickedDate] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [dayHasLog, setDayHasLog] = useState<boolean>(false);
  const [isInFuture, setIsInFuture] = useState<boolean>(false);
  const [loggedDates, setLoggedDates] = useState<Array<string>>([]);

  function grabDates() {
    getDates()
      .then((res) => setLoggedDates(res))
      .catch((err) => setError(`An error has occurred, please try again later. ${err}`));
  }

  useEffect(() => {
    grabDates();
  }, []);

  function handleClick(date: Date) {
    const formattedDate = moment(date).format('DD-MM-YYYY');
    setClickedDate(formattedDate);
    setDayHasLog(loggedDates.includes(formattedDate));
    setIsInFuture(moment(date).isAfter());
    history.push(`/logs/${formattedDate}`);
  }

  function ifLogged(date: Date, view: string): string {
    const hasLog = loggedDates.includes(moment(date).format('DD-MM-YYYY'));
    return view === 'month' && hasLog ? 'dayWithLog' : '';
  }

  function ifFuture(date: Date, view: string): string {
    const isFuture = moment(date).isAfter();
    return view === 'month' && isFuture ? 'dayInFuture' : '';
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Calendar onClickDay={handleClick} tileClassName={({ date, view }: { date: Date; view: string }) => [ifLogged(date, view), ifFuture(date, view)]} />
      <Message negative style={{ display: error ? 'block' : 'none' }} header={error} />
      <div style={{ margin: '1rem', width: '40%', display: 'flex' }}>
        {!isInFuture && dayHasLog ? (
          <Link to={`/logs/remove/${clickedDate}`} replace>
            <Button content="Remove Log" style={{ width: '50%' }} size="huge" />
          </Link>
        ) : null}
        {!isInFuture && dayHasLog ? (
          <Link to={`/logs/view/${clickedDate}`} replace>
            <Button content="View Log" style={{ width: '50%' }} size="huge" />
          </Link>
        ) : null}
        {!isInFuture && !dayHasLog ? (
          <Link to={`/logs/create/${clickedDate}`} replace>
            <Button content="Create Log" style={{ width: '50%' }} size="huge" />
          </Link>
        ) : null}
      </div>
      <Switch>
        <>
          <Route path="/logs/create/:date">
            <LogScreenCreate />
          </Route>
          <Route path="/logs/remove/:date">
            <LogScreenRemove />
          </Route>
          <Route path="/logs/view/:date">
            <LogScreenView />
          </Route>
        </>
      </Switch>
    </div>
  );
}

function LogScreenCreate(): ReactElement {
  const history = useHistory();
  const { date } = useParams<{ date: string }>();
  const [selectedName, setSelectedName] = useState<string>('');
  const [warningMessage, setWarningMessage] = useState<string>('');
  const [bw, setBw] = useState<string>('');
  const [bwError, setBwError] = useState<boolean>(false);
  const log = useContext(LogStatsContext);

  function addExercise() {
    setWarningMessage('');
    log.setStats(log.stats.concat([{ key: uuid(), exerciseName: selectedName, data: [] }]));
    console.log(log.stats);
  }

  function handleSubmit() {
    let invalidInput = false;

    for (let i = 0; i < Object.values(log.stats).length; i++) {
      const exercise: any = Object.values(log.stats)[i];

      invalidInput = exercise.data.some(({ reps, weight }: { reps: string; weight: string }) => {
        if (!/^\d+$/.test(reps) || !/^\d*\.?(?:\d{1,2})?$/.test(weight) || reps === '' || weight === '') {
          return true;
        }
        return false;
      });
    }

    if (log.stats.length === 0) {
      setWarningMessage('Please enter an exercise.');
    } else if (invalidInput) {
      setWarningMessage('Please fill in all input boxes with valid numbers.');
    } else if (bwError || bw === '') {
      setWarningMessage('Please input a valid bodyweight.');
    } else {
      addLog(log.stats, Number(bw), date);
      log.setStats([]);
      history.push('/logs');
    }
  }

  function handleChange(value) {
    setBw(value);
    setBwError(!/^\d*\.?(?:\d{1,2})?$/.test(value));
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '1rem',
      }}
    >
      <Form
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {log.stats.map((data) => (
          <ExerciseRow exerciseKey={data.key} key={data.key} name={data.exerciseName} />
        ))}
      </Form>
      <Dropdown
        allowAdditions
        additionPosition="bottom"
        placeholder="Select Exercise"
        search
        selection
        options={retrieveExercise()}
        onAddItem={(_, event) => createExercise(event.value as string)}
        onChange={(_, text) => setSelectedName(text.value as string)}
      />
      <Input error={bwError} placeholder="Bodyweight" onChange={(_, data) => handleChange(data.value)} />
      <div style={{ margin: '3px' }}>
        <Button onClick={addExercise}>Add exercise</Button>
        <Button primary onClick={handleSubmit}>
          Submit
        </Button>
      </div>
      <h2 style={{ color: 'red' }}>{warningMessage}</h2>
    </div>
  );
}

function LogScreenView(): ReactElement {
  const { date } = useParams<{ date: string }>();
  const weightUnit = useContext(WeightUnitContext);
  const [log, setLog] = useState<LogInterface>();

  useEffect(() => {
    getWorkoutLog(date)
      .then((res) => setLog(res))
      .catch((err) => console.log(err));
  }, []);

  if (log) {
    return (
      <div style={{ textAlign: 'center' }}>
        <h2>
          Bodyweight: {log.bw}
          {weightUnit.weightUnit}
        </h2>
        <Table compact celled structured>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Exercise</Table.HeaderCell>
              <Table.HeaderCell>Reps</Table.HeaderCell>
              <Table.HeaderCell>Weight</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {Object.values(log.exercises).map((el: ExercisesInterface, i: number) => (
              <TableExerciseRow key={i} name={el.name} sets={el.sets} />
            ))}
          </Table.Body>
        </Table>
      </div>
    );
  }
  return <div />;
}

function LogScreenRemove(): ReactElement {
  const { date } = useParams<{ date: string }>();
  const history = useHistory();

  function removeLogAndDiv() {
    removeLog(date);
    history.push('/logs');
  }

  return (
    <div style={{ display: 'block', textAlign: 'center' }}>
      <h2>Are you sure?</h2>
      <Button negative onClick={removeLogAndDiv}>
        Delete
      </Button>
      <Button positive onClick={() => history.push('/logs')}>
        Return
      </Button>
    </div>
  );
}

function ExerciseRow({ name, exerciseKey }): ReactElement {
  const log = useContext(LogStatsContext);
  const [sets, setSets] = useState<any>([{ key: uuid(), reps: '', weight: '', repsError: false, weightError: false }]);

  function addSet() {
    setSets(sets.concat([{ key: uuid(), reps: '', weight: '', repsError: false, weightError: false }]));
  }

  function deleteExercise() {
    log.setStats(log.stats.filter((el) => el.key !== exerciseKey));
  }

  function deleteSet(setKey: string) {
    if (sets.length === 1) {
      deleteExercise();
    }
    setSets(sets.filter((el) => el.key !== setKey));
  }

  function handleChange(value: string, type: string, setKey: string) {
    const arr = sets;
    const setIndex = arr.findIndex((el) => el.key === setKey);
    if (type === 'reps') {
      arr[setIndex].repsError = !/^\d+$/.test(value);
    } else {
      arr[setIndex].weightError = !/^\d*\.?(?:\d{1,2})?$/.test(value);
    }
    arr[setIndex][type] = value;
    setSets(arr);
  }

  useEffect(() => {
    const arr = log.stats;
    const exerciseIndex = arr.findIndex((el) => el.key === exerciseKey);
    arr[exerciseIndex].data = sets;
    log.setStats(arr);
  }, [sets]);

  return (
    <div style={{ width: '100%', display: 'flex' }}>
      <div style={{ width: '20%', display: 'inline-flex', alignItems: 'flex-start', margin: '5px' }}>
        <Icon onClick={deleteExercise} name="delete" style={{ cursor: 'pointer' }} size="big" color="red" />
        <p style={{ fontSize: '1.5rem' }}>{name}:</p>
      </div>
      <div style={{ display: 'inline' }}>
        {sets.map((set, i) => (
          <div key={set.key} style={{ display: 'flex', marginBottom: '3px', alignItems: 'center' }}>
            <Form.Input error={set.repsError} placeholder="Reps" onChange={(_, data) => handleChange(data.value, 'reps', set.key)} />
            <Form.Input error={set.weightError} placeholder="Weight" onChange={(_, data) => handleChange(data.value, 'weight', set.key)} />
            <Icon onClick={() => deleteSet(set.key)} name="trash alternate" style={{ cursor: 'pointer' }} size="large" color="red" />
            {i === sets.length - 1 ? <Icon onClick={addSet} name="add" style={{ cursor: 'pointer' }} size="big" color="green" /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function TableExerciseRow({ name, sets }: { name: string; sets: { weight: number; reps: number }[] }): ReactElement {
  const weightUnit = useContext(WeightUnitContext);
  return (
    <>
      {sets.map(({ weight, reps }, i) => {
        if (i === 0) {
          return (
            <Table.Row key={i}>
              <Table.Cell rowSpan={sets.length}>
                <Header as="h4" textAlign="center">
                  {name}
                </Header>
              </Table.Cell>
              <Table.Cell textAlign="center">{reps}</Table.Cell>
              <Table.Cell textAlign="center">
                {weight}
                {weightUnit.weightUnit}
              </Table.Cell>
            </Table.Row>
          );
        }
        return (
          <Table.Row key={i}>
            <Table.Cell textAlign="center">{reps}</Table.Cell>
            <Table.Cell textAlign="center">
              {weight}
              {weightUnit.weightUnit}
            </Table.Cell>
          </Table.Row>
        );
      })}
    </>
  );
}

export default Logs;
