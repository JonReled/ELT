import { postLogin } from 'Database';
import React, { ReactElement, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon, Form, Message, Segment, Header } from 'semantic-ui-react';

interface LoginInterface {
  identification: string;
  password: string;
}

function Login(): ReactElement {
  const [userData, setUserData] = useState<LoginInterface>({ identification: '', password: '' });
  const [error, setError] = useState<string>('');
  const [passwordShown, setPasswordShown] = useState<boolean>(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const { id, value } = e.target;
    setUserData({ ...userData, [id]: value });
  }

  function handleSubmit(): void {
    postLogin(userData).catch((err) => {
      switch (err) {
        case 401:
          setError('Incorrect user credentials.');
          break;
        default:
          setError('An error has occurred, please try again later.');
          break;
      }
    });
  }

  function changeInputState(): void {
    setPasswordShown(!passwordShown);
  }

  return (
    <div style={{ textAlign: 'center', width: '33%', margin: '0 auto', minWidth: '250px' }}>
      <Header as="h1" icon>
        <Icon name="user" />
        Login
      </Header>
      <Segment>
        <Form>
          <Form.Input
            style={{ marginBottom: '0.5em' }}
            id="identification"
            onChange={handleChange}
            fluid
            label="Username or Email address"
            placeholder="Username or Email address"
          />
          <Form.Input
            style={{ marginBottom: '0.5em' }}
            id="password"
            type={passwordShown ? 'text' : 'password'}
            onChange={handleChange}
            fluid
            label="Password"
            placeholder="Password"
            icon={<Icon onMouseOver={changeInputState} onMouseOut={changeInputState} name="eye" circular link />}
          />
          <Message negative style={{ display: error ? 'block' : 'none' }} header={error} />
          <Link to="/register" style={{ marginBottom: '0.5em', display: 'block' }}>
            Don't have an account?
          </Link>
          <Form.Button onClick={handleSubmit}>Login</Form.Button>
        </Form>
      </Segment>
    </div>
  );
}

export default Login;
