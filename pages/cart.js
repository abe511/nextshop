import { useState } from 'react';
import { Segment } from 'semantic-ui-react';
import axios from 'axios';
import { parseCookies } from 'nookies';
import CartItemList from '../components/Cart/CartItemList';
import baseURL from '../utils/baseURL';
import catchErrors from '../utils/catchErrors';

function Cart({ user, products }) {
  const [cartProducts, setCartProducts] = useState(products);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // sends a DELETE request to the Cart API
  async function handleRemoveFromCart(productID, orderQuantity) {
    const { token } = parseCookies({}, 'token');
    const payload = {
      params: { productID, orderQuantity },
      headers: { Authorization: token }
    };
    const response = await axios.delete(`${baseURL}/api/cart`, payload);
    // new Products array received and passed down to CartItemList component
    setCartProducts(response.data);
  }

  async function handleCheckout(paymentData) {
    try {
      setLoading(true);
      // constructing POST request for Checkout
      const { token } = parseCookies({}, 'token');
      const payload = { paymentData };
      const headers = { headers: { Authorization: token } };
      await axios.post(`${baseURL}/api/checkout`, payload, headers);
      setSuccess(true);
    } catch (error) {
      catchErrors(error, window.alert);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Segment loading={loading}>
        <CartItemList
          user={user}
          success={success}
          products={cartProducts}
          handleCheckout={handleCheckout}
          handleRemoveFromCart={handleRemoveFromCart}
        />
      </Segment>
    </>
  );
}

Cart.getInitialProps = async (ctx) => {
  // return empty cart if no token found in cookies
  const { token } = parseCookies(ctx);
  if (!token) {
    return { products: [] };
  }
  // request initial products
  const payload = { headers: { Authorization: token } };
  const response = await axios.get(`${baseURL}/api/cart`, payload);
  return { products: response.data };
};

export default Cart;
