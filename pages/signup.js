import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import catchErrors from '../utils/catchErrors';
import baseURL from '../utils/baseURL';
import { handleLogin } from '../utils/auth';
import {
  Button,
  Form,
  Icon,
  Segment,
  Message,
  Divider
} from 'semantic-ui-react';

const INITIAL_USER = { name: '', password: '', email: '' };

function Signup() {
  const [user, setUser] = useState(INITIAL_USER);
  const [enable, setEnable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // check if all fields in the form are filled in and enable and Submit button.
  useEffect(() => {
    const allFilled = Object.values(user).every((element) => {
      return element;
    });
    setEnable(allFilled);
  }, [user]);

  // adding entered values to the user state
  function handleChange(event) {
    const { name, value } = event.target;
    setUser((prevState) => {
      return { ...prevState, [name]: value };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setLoading(true);
      setErrorMessage('');

      const url = `${baseURL}/api/signup`;
      const payload = { ...user };
      const response = await axios.post(url, payload);
      handleLogin(response.data);
    } catch (error) {
      catchErrors(error, setErrorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Form
        onSubmit={handleSubmit}
        loading={loading}
        error={Boolean(errorMessage)}
        warning
      >
        {!errorMessage ? (
          <Message
            header="Get started!"
            content="Create a new account."
            color="blue"
            icon="settings"
          />
        ) : (
          <Message icon="x" header="Error." content={errorMessage} error />
        )}

        <Segment>
          <Form.Input
            icon="user"
            iconPosition="left"
            label="Name"
            name="name"
            placeholder="Name"
            value={user.name}
            onChange={handleChange}
            fluid
          />
          <Form.Input
            icon="envelope"
            iconPosition="left"
            label="Email"
            name="email"
            placeholder="Email"
            type="email"
            value={user.email}
            onChange={handleChange}
            fluid
          />
          <Form.Input
            icon="lock"
            iconPosition="left"
            label="Password"
            name="password"
            placeholder="Password"
            type="password"
            value={user.password}
            onChange={handleChange}
            fluid
          />
          <Divider />
          <Button
            icon="signup"
            content="Sign up"
            type="submit"
            color="green"
            disabled={!enable || loading}
          />
        </Segment>
        <Message warning>
          <Icon name="help circle" />
          {'Already have an account? '}
          <Link href="./login">
            <a>
              <strong>Sign in.</strong>
            </a>
          </Link>
        </Message>
      </Form>
    </>
  );
}

export default Signup;
