import React, { ReactElement, useEffect, useState } from 'react';
import { Segment, Form, Icon, Message, Header } from 'semantic-ui-react';
import './index.css';
import { Link } from 'react-router-dom';
import { postRegister } from 'Database';

interface ErrorsType {
  username: boolean;
  email: boolean;
  password: boolean;
}

interface UserDataType {
  username: string;
  email: string;
  password: string;
}

function Register(): ReactElement {
  const [invalid, setInvalid] = useState<ErrorsType>({ username: false, email: false, password: false });
  const [userData, setUserData] = useState<UserDataType>({ username: '', email: '', password: '' });
  const [submitDisabled, setSubmitDisabled] = useState<boolean>(true);
  const [passwordShown, setPasswordShown] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const { id, value } = e.target;
    setUserData({ ...userData, [id]: value });
    switch (id) {
      case 'username':
        setInvalid({ ...invalid, username: !/^[A-Za-z0-9_&.]*$/.test(value) });
        break;
      case 'email':
        setInvalid({ ...invalid, email: !/\S+@\S+\.\S+/.test(value) });
        break;
      case 'password':
        setInvalid({ ...invalid, password: !/^[A-Za-z0-9[#?!@$%^&*-.]{8,}$/.test(value) });
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    if (Object.values(invalid).some((x) => x) || Object.values(userData).some((x) => !x)) {
      setSubmitDisabled(true);
    } else {
      setSubmitDisabled(false);
    }
  }, [userData, invalid]);

  function handleSubmit(): void {
    postRegister(userData)
      .then(() => setSuccess('Registration successful, head to the login page.'))
      .catch((err) => {
        switch (err) {
          case 409:
            setError('Email address or username already in use.');
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
    <div style={{ textAlign: 'center', width: '33%', margin: 'auto', minWidth: '250px' }}>
      <Header as="h1" icon>
        <Icon name="user" />
        Register
      </Header>
      <Segment>
        <Form>
          <Form.Input
            style={{ marginBottom: '0.5em' }}
            id="username"
            onChange={handleChange}
            fluid
            label="Username"
            placeholder="Username"
            error={invalid.username ? 'Invalid username' : false}
          />
          <Form.Input
            style={{ marginBottom: '0.5em' }}
            id="email"
            onChange={handleChange}
            fluid
            label="Email address"
            placeholder="Email address"
            error={invalid.email ? 'Invalid email' : false}
          />
          <Form.Input
            id="password"
            type={passwordShown ? 'text' : 'password'}
            onChange={handleChange}
            fluid
            label="Password"
            placeholder="Password"
            error={invalid.password ? 'Invalid password (Minimum length is 8 characters)' : false}
            icon={<Icon onMouseOver={changeInputState} onMouseOut={changeInputState} name="eye" circular link />}
          />
          <Message negative style={{ display: error ? 'block' : 'none' }} header={error} />
          <Message success style={{ display: success ? 'block' : 'none' }} header="Registration successful, head to the login page." />
          <Link to="/login" style={{ marginBottom: '0.5em', display: 'block' }}>
            Already have an account?
          </Link>
          <Form.Button disabled={submitDisabled} onClick={handleSubmit}>
            Register
          </Form.Button>
        </Form>
      </Segment>
    </div>
  );
}

export default Register;
