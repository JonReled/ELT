import React, { ReactElement, useState, SetStateAction, Dispatch, useEffect } from 'react';
import { Button } from 'semantic-ui-react';

const database = [
  { name: 'Starting Strength', author: 'Mark Rippetoe', level: 'Beginner', days: '3'},
  { name: 'Stronglifts 5x5', author: 'Mehdi', level: 'Beginner', days: '3'}
];

interface Program {
  name: string;
  author: string;
  level: string;
  days: string;
  handleClick: Dispatch<SetStateAction<string>>;
}

function Programs(): ReactElement {
  const [viewedProgram, setViewedProgram] = useState('none');
  console.log(database[viewedProgram]);
  const [visible, setVisible] = useState(<div></div>);
  useEffect(() => {
    setVisible(<View {...database.find(el => el.name === viewedProgram) as any} />);
  }, [viewedProgram])

  return (
    <div>
    {database.map(program => (
      <Row {...program} handleClick={setViewedProgram}/>
    ))}
    {visible}
    </div>
  );
}

function Row({ name, author, level, days, handleClick }: Program): ReactElement {
  return(
    <div style={{display: 'flex', alignItems: 'center', position: 'relative'}}>
      <div style={{width: '33%'}}>
        <h1>{name}</h1>
        <p>{author}</p>
      </div>
      <div style={{width: '33%'}}>
        <p>Level: {level}</p>
        <p>{days} days per week</p>
      </div>

      <Button onClick={() => handleClick(name)} primary style={{position: 'absolute', bottom: '0', right: '0'}}>View</Button>
    </div>
  )
}

function View({ name, author, level, days }: Program): ReactElement {
  return (
    <div>
      <h1>{name}</h1>
      <h1>sup</h1>
    </div>
  );
}

export default Programs