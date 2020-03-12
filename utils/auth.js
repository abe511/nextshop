import { setCookie, destroyCookie } from 'nookies';
import Router from 'next/router';

// redirect to Profile page on login
export function handleLogin(token) {
  setCookie({}, 'token', token);
  Router.push('/account');
  window.localStorage.setItem('login', Date.now());
}
// redirect to Home page on logout
export function handleLogout(token) {
  destroyCookie({}, 'token');
  Router.push('/');
  window.localStorage.setItem('logout', Date.now());
}

export function redirectUser(ctx, location) {
  // check if context is accessible and redirect on the server
  if (ctx.req) {
    ctx.res.writeHead(302, { Location: location });
    ctx.res.end();
  } else {
    // if not - redirect on the client
    Router.push(location);
  }
}
