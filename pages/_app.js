import Router from 'next/router';
import axios from 'axios';
import { parseCookies, destroyCookie } from 'nookies';
import App from 'next/app';
import Layout from '../components/_App/Layout';
import { redirectUser } from '../utils/auth';
import baseURL from '../utils/baseURL';

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    // set initial props to each component within its context
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    // check if the user tries to access protected routes without a token
    // and redirect the user to Login pages
    const { token } = parseCookies(ctx);
    const path = ctx.pathname;

    if (!token) {
      const isProtectedRoute = path === '/account' || path === '/create';
      if (isProtectedRoute) {
        redirectUser(ctx, '/login');
      }
    } else {
      // get user's account data with the token
      try {
        const payload = { headers: { Authorization: token } };
        const url = `${baseURL}/api/account`;
        const response = await axios.get(url, payload);
        const user = response.data;
        // only 'root' and 'admin' users allowed to access /create path
        const isRoot = user.role === 'root';
        const isAdmin = user.role === 'admin';
        const accessForbidden = !(isRoot || isAdmin) && path === '/create';
        if (accessForbidden) {
          redirectUser(ctx, '/');
        }
        pageProps.user = user;
      } catch (error) {
        console.error('Error retrieving user data', error);
        // 1. dispose invalid token
        destroyCookie(ctx, 'token');
        // 2. redirect to login page
        redirectUser(ctx, '/login');
      }
    }

    return { pageProps };
  }

  componentDidMount() {
    // listen to local storage changes
    addEventListener('storage', this.syncLogInOut);
  }

  // on storage change event
  syncLogInOut = (event) => {
    // login to Profile page and remove local storage item created by auth util
    if (event.key === 'login') {
      Router.push('/account');
      window.localStorage.removeItem('login');
    }
    // logout to Home page and remove local storage item created by auth util
    if (event.key === 'logout') {
      Router.push('/');
      window.localStorage.removeItem('logout');
    }
  };

  render() {
    const { Component, pageProps } = this.props;
    return (
      <>
        {/* assign all initial props to components along with other props */}
        <Layout {...pageProps}>
          <Component {...pageProps} />
        </Layout>
      </>
    );
  }
}

export default MyApp;
