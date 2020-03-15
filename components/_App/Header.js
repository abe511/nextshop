import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import NProgress from 'nprogress';
import { Container, Menu, Icon, Image } from 'semantic-ui-react';
import { handleLogout } from '../../utils/auth';

Router.onRouteChangeStart = () => {
  return NProgress.start();
};
Router.onRouteChangeComplete = () => {
  return NProgress.done();
};
Router.onRouteChangeError = () => {
  return NProgress.done();
};

function Header({ user }) {
  const router = useRouter();
  const isRoot = user && user.role === 'root';
  const isAdmin = user && user.role === 'admin';
  const isAdminOrRoot = isAdmin || isRoot;

  function isActive(route) {
    return route === router.pathname;
  }

  return (
    <Menu id="menu" stackable fluid inverted>
      <Container text>
        <Link href="/">
          <Menu.Item header active={isActive('/')}>
            <Image src="../../static/NEXT_logo.png" size="small" />
          </Menu.Item>
        </Link>
        <Link href="/cart">
          <Menu.Item header active={isActive('/cart')}>
            <Icon name="cart" size="large" />
            Cart
          </Menu.Item>
        </Link>

        {/* display Create link if the user is logged in */}
        {isAdminOrRoot && (
          <Link href="/create">
            <Menu.Item header active={isActive('/create')}>
              <Icon name="add circle" size="large" />
              Add New Product
            </Menu.Item>
          </Link>
        )}

        {/* display User Profile and Log out links if the user is logged in.
            otherwise display Sign in and Sign up links. */}
        {user ? (
          <>
            <Link href="/account">
              <Menu.Item header active={isActive('/account')}>
                <Icon name="user" size="large" />
                Profile
              </Menu.Item>
            </Link>

            <Menu.Item header onClick={handleLogout}>
              <Icon name="log out" size="large" />
              Log out
            </Menu.Item>
          </>
        ) : (
          <>
            <Link href="/login">
              <Menu.Item header active={isActive('/login')}>
                <Icon name="sign in" size="large" />
                Sign in
              </Menu.Item>
            </Link>

            <Link href="/signup">
              <Menu.Item header active={isActive('/signup')}>
                <Icon name="signup" size="large" />
                Sign up
              </Menu.Item>
            </Link>
          </>
        )}
      </Container>
    </Menu>
  );
}

export default Header;
