import React, { ReactElement, useState, SetStateAction, Dispatch, useEffect, useContext } from 'react';
import { Button, Table, Header, Grid, Segment } from 'semantic-ui-react';
import { setUserProgram, retrievePrograms } from './Database';
import { NumericOnlyInput } from './components';
import { NewProgramContext } from './Context';

export interface Program {
  name: string;
  author: string;
  level: string;
  days: string;
  program: Array<Array<{ exerciseName: string; Sets: number; Reps: number }>>;
  notes: string;
  setViewedName: Dispatch<SetStateAction<string>>;
  setEditing: Dispatch<SetStateAction<boolean>>;
}

type ProgramNoMethods = Omit<Program, 'setViewedName' | 'setEditing'>;

function Programs(): ReactElement {
  const [viewedName, setViewedName] = useState<string>('');
  const [editing, setEditing] = useState<boolean>(false);
  const [database] = useState<Array<ProgramNoMethods>>(retrievePrograms());

  if (editing) {
    return <Edit {...(database.find((el) => el.name === viewedName) as ProgramNoMethods)} setEditing={setEditing} />;
  }
  if (viewedName) {
    return <View {...(retrievePrograms().find((el) => el.name === viewedName) as ProgramNoMethods)} setViewedName={setViewedName} setEditing={setEditing} />;
  }
  return (
    <Grid divided="vertically">
      {database.map((item) => (
        <Grid.Row>
          <Row {...item} setViewedName={setViewedName} />
        </Grid.Row>
      ))}
    </Grid>
  );
}

function Row({ name, author, level, days, setViewedName }: Omit<Program, 'setEditing'>): ReactElement {
  return (
    <div style={{ display: 'flex', alignItems: 'center', position: 'relative', width: '100%' }}>
      <div style={{ width: '33%' }}>
        <h1>{name}</h1>
        <p>{author}</p>
      </div>
      <div style={{ width: '33%' }}>
        <p>Level: {level}</p>
        <p>{days} days per week</p>
      </div>

      <Button onClick={() => setViewedName(name)} primary style={{ position: 'absolute', bottom: '0', right: '0' }}>
        View
      </Button>
    </div>
  );
}

function View({ name, author, level, days, program, notes, setEditing, setViewedName }: Program): ReactElement {
  const [chooseScreenDisplayed, setChooseScreenDisplayed] = useState('none');

  function updateProgram(willUpdate: boolean) {
    setChooseScreenDisplayed('none');
    if (willUpdate) {
      setUserProgram({
        name,
        author,
        level,
        days,
        program,
        notes,
      });
    }
  }

  return (
    <div style={{ textAlign: 'center', position: 'relative' }}>
      <div style={{ display: 'flex' }}>
        <Button onClick={() => setViewedName('')}>Return</Button>
        <h1
          style={{
            position: 'absolute',
            display: 'inline-block',
            fontSize: '3rem',
            left: '50%',
            transform: 'translate(-50%, 0)',
          }}
        >
          {name}
        </h1>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '2rem',
        }}
      >
        <h3 style={{ width: '30%' }}>{notes}</h3>
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1rem' }}>
          {program.map((el, i) => (
            <ProgramTable day={el} index={i} />
          ))}
        </div>
      </div>
      <div>
        <Button style={{ width: '100px', marginRight: '2px' }} onClick={() => setEditing(true)}>
          Edit
        </Button>
        <Button style={{ width: '100px', marginRight: '2px' }} onClick={() => setChooseScreenDisplayed('block')}>
          Choose
        </Button>
      </div>
      <ConfirmChange updateProgram={updateProgram} isDisplayed={chooseScreenDisplayed} />
    </div>
  );
}

function ProgramTable({ day, index }): ReactElement {
  return (
    <div style={{ marginRight: '2px' }}>
      <h1>Day {index + 1}</h1>
      <Table celled padded style={{ maxWidth: '720px' }}>
        <Table.Header>
          <Table.Row style={{ textAlign: 'center', fontSize: '1.5rem' }}>
            <Table.HeaderCell style={{ width: '25%' }}>Exercise</Table.HeaderCell>
            <Table.HeaderCell style={{ width: '25%' }}>Sets</Table.HeaderCell>
            <Table.HeaderCell style={{ width: '25%' }}>Reps</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {day.map((el) => (
            <TableRow {...el} />
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}

function TableRow({ exerciseName, Sets, Reps }): ReactElement {
  return (
    <Table.Row>
      <Table.Cell>
        <Header as="h4" textAlign="center">
          {exerciseName}
        </Header>
      </Table.Cell>
      <Table.Cell textAlign="center">{Sets}</Table.Cell>
      <Table.Cell textAlign="center">{Reps}</Table.Cell>
    </Table.Row>
  );
}

function ConfirmChange({ updateProgram, isDisplayed }): ReactElement {
  return (
    <Segment
      style={{
        textAlign: 'center',
        display: isDisplayed,
        marginTop: '1rem',
        maxWidth: '720px',
        position: 'relative',
        left: '50%',
        transform: 'translate(-50%, 0)',
      }}
    >
      <h3>Are you sure? This program will replace your currently active one.</h3>
      <Button negative onClick={() => updateProgram(false)} style={{ marginRight: '2px' }}>
        Cancel
      </Button>
      <Button positive onClick={() => updateProgram(true)}>
        Confirm
      </Button>
    </Segment>
  );
}

function Edit({ name, author, level, days, program, notes, setEditing }: Omit<Program, 'setViewedName'>): ReactElement {
  const newProgram = useContext(NewProgramContext);

  useEffect(() => {
    newProgram.setProgram(program);
  }, [program]);

  function confirmEdit() {
    const editedProgram = {
      name,
      author,
      level,
      days,
      program: newProgram.program,
      notes,
    };
    setEditing(false);
    setUserProgram(editedProgram);
  }

  return (
    <div style={{ textAlign: 'center', position: 'relative' }}>
      <div style={{ display: 'flex' }}>
        <Button onClick={() => setEditing(false)}>Return</Button>
        <h1
          style={{
            position: 'absolute',
            display: 'inline-block',
            fontSize: '3rem',
            left: '50%',
            transform: 'translate(-50%, 0)',
          }}
        >
          {name}
        </h1>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '2rem',
        }}
      >
        <h3 style={{ width: '30%' }}>{notes}</h3>
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1rem' }}>
          {program.map((el, i) => (
            <EditDay day={el} dayIndex={i} />
          ))}
        </div>
      </div>
      <Button primary onClick={confirmEdit}>
        Confirm
      </Button>
    </div>
  );
}

function EditDay({ day, dayIndex }): ReactElement {
  return (
    <div style={{ marginRight: '2px' }}>
      <h1>Day {dayIndex + 1}</h1>
      <Table celled padded style={{ maxWidth: '720px' }}>
        <Table.Header>
          <Table.Row style={{ textAlign: 'center', fontSize: '1.5rem' }}>
            <Table.HeaderCell style={{ width: '25%' }}>Exercise</Table.HeaderCell>
            <Table.HeaderCell style={{ width: '25%' }}>Sets</Table.HeaderCell>
            <Table.HeaderCell style={{ width: '25%' }}>Reps</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {day.map((el, i) => (
            <EditRow {...el} dayIndex={dayIndex} exerciseIndex={i} />
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}

function EditRow({
  exerciseName,
  Sets,
  Reps,
  dayIndex,
  exerciseIndex,
}: {
  exerciseName: string;
  Sets: string;
  Reps: string;
  dayIndex: number;
  exerciseIndex: number;
}): ReactElement {
  const newProgram = useContext(NewProgramContext);

  function updateNewProgram(value, unit) {
    const temp = newProgram.program;
    temp[dayIndex][exerciseIndex][unit] = value;
    newProgram.setProgram(temp);
  }

  return (
    <Table.Row>
      <Table.Cell>
        <Header as="h4" textAlign="center">
          {exerciseName}
        </Header>
      </Table.Cell>
      <Table.Cell textAlign="center">
        <NumericOnlyInput defaultValue={Sets} placeholder="" handleChange={(value) => updateNewProgram(value, 'Sets')} />
      </Table.Cell>
      <Table.Cell textAlign="center">
        <NumericOnlyInput defaultValue={Reps} placeholder="" handleChange={(value) => updateNewProgram(value, 'Reps')} />
      </Table.Cell>
    </Table.Row>
  );
}

export default Programs;
