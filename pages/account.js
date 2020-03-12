import axios from 'axios';
import AccountHeader from '../components/Account/AccountHeader';
import AccountOrders from '../components/Account/AccountOrders';
import AccountPermissions from '../components/Account/AccountPermissions';
import { parseCookies } from 'nookies';
import baseURL from '../utils/baseURL';

function Account({ user, orders }) {
  return (
    <>
      <AccountHeader {...user} />
      <AccountOrders orders={orders} />
      {user.role === 'root' && <AccountPermissions />}
    </>
  );
}

Account.getInitialProps = async (ctx) => {
  const { token } = parseCookies(ctx);
  // check if a user has no token (just in case)
  if (!token) {
    return { orders: [] };
  }
  // construct a GET request to retrieve initial Orders data
  const payload = { headers: { Authorization: token } };
  const response = await axios.get(`${baseURL}/api/orders`, payload);
  return response.data;
};

export default Account;
