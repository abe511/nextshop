import { Header, Segment, Label, Icon } from 'semantic-ui-react';
import formatDate from '../../utils/formatDate';

// Account page header
function AccountHeader({ name, email, role, createdAt }) {
  return (
    <>
      <Segment color="blue" secondary inverted>
        <Label
          style={{ textTransform: 'capitalize' }}
          content={role}
          icon="privacy"
          size="large"
          color="violet"
          ribbon
        ></Label>
        <Header as="h3" textAlign="center" inverted icon>
          <Icon name="user" />
          {name}
          <Header.Subheader>{email}</Header.Subheader>
          <Header.Subheader>Joined {formatDate(createdAt)}</Header.Subheader>
        </Header>
      </Segment>
    </>
  );
}

export default AccountHeader;
