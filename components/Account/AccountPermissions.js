import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { parseCookies } from 'nookies';
import { Header, Table, Checkbox, Icon } from 'semantic-ui-react';
import baseURL from '../../utils/baseURL';
import formatDate from '../../utils/formatDate';

function AccountPermissions() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  async function getUsers() {
    // construct a GET request
    const { token } = parseCookies({}, 'token');
    const payload = { headers: { Authorization: token } };
    const response = await axios.get(`${baseURL}/api/users`, payload);
    setUsers(response.data);
  }

  return (
    <div style={{ margin: '2em 0' }}>
      <Header as="h2">
        <Icon name="settings" />
        User Permissions
      </Header>
      <Table compact celled definition>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>E-mail</Table.HeaderCell>
            <Table.HeaderCell>Joined</Table.HeaderCell>
            <Table.HeaderCell>Updated</Table.HeaderCell>
            <Table.HeaderCell>Role</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {users.map((user) => {
            return <UserPermission user={user} key={user._id} />;
          })}
        </Table.Body>
      </Table>
    </div>
  );
}

function UserPermission({ user }) {
  // set this state depending on initial user status
  const [admin, setAdmin] = useState(user.role === 'admin');

  // skip updatePermission on the first run
  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    updatePermission();
  }, [admin]);

  async function updatePermission() {
    // send PUT request with the user ID and its current role
    const payload = { _id: user._id, role: admin ? 'admin' : 'user' };
    await axios.put(`${baseURL}/api/account`, payload);
  }

  function handleChangePermission() {
    setAdmin((prevState) => {
      return !prevState;
    });
  }

  return (
    <Table.Row>
      <Table.Cell collapsing>
        <Checkbox onClick={handleChangePermission} checked={admin} toggle />
      </Table.Cell>
      <Table.Cell collapsing>{user.name}</Table.Cell>
      <Table.Cell collapsing>{user.email}</Table.Cell>
      <Table.Cell collapsing>{formatDate(user.createdAt)}</Table.Cell>
      <Table.Cell collapsing>{formatDate(user.updatedAt)}</Table.Cell>
      <Table.Cell collapsing>{admin ? 'admin' : 'user'}</Table.Cell>
    </Table.Row>
  );
}

export default AccountPermissions;
