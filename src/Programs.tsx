import React, { ReactElement, useState, SetStateAction, Dispatch } from 'react';
import { Button, Table, Header, Grid, Segment } from 'semantic-ui-react';
import { setUserProgram, retrievePrograms } from './Database';

export interface Program {
  name: string;
  author: string;
  level: string;
  days: string;
  program: Array<Array<{ exerciseName: string; Sets: number; Reps: number }>>;
  notes: string;
  setViewedName: Dispatch<SetStateAction<string>>;
}

type ProgramNoMethods = Omit<Program, 'setViewedName'>;

function Programs(): ReactElement {
  const [viewedName, setViewedName] = useState<string>('');
  const [database] = useState<Array<ProgramNoMethods>>(retrievePrograms());

  if (viewedName) {
    return <View {...(retrievePrograms().find((el) => el.name === viewedName) as ProgramNoMethods)} setViewedName={setViewedName} />;
  }
  return (
    <Grid divided="vertically">
      {database.map((item, i) => (
        <Grid.Row key={i}>
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

function View({ name, author, level, days, program, notes, setViewedName }: Program): ReactElement {
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
            <ProgramTable key={i} day={el} index={i} />
          ))}
        </div>
      </div>
      <div>
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
          {day.map((el, i) => (
            <TableRow key={i} {...el} />
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

export default Programs;
