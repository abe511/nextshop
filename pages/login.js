import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
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

const INITIAL_USER = { password: '', email: '' };

function Login() {
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
      const url = `${baseURL}/api/login`;
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
            header="Welcome back!"
            content="Sign in with your e-mail and password."
            color="blue"
            icon="privacy"
          />
        ) : (
          <Message icon="x" header="Error." content={errorMessage} error />
        )}

        <Segment>
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
            icon="sign in"
            content="Sign in"
            type="submit"
            color="green"
            disabled={!enable || loading}
          />
        </Segment>
        <Message warning>
          <Icon name="help circle" />
          {"Don't have an account? "}
          <Link href="./signup">
            <a>
              <strong>Sign up.</strong>
            </a>
          </Link>
        </Message>
      </Form>
    </>
  );
}

export default Login;
