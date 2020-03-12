import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Input, Label } from 'semantic-ui-react';
import { parseCookies } from 'nookies';
import baseURL from '../../utils/baseURL';
import catchErrors from '../../utils/catchErrors';

function AddProductToCart({ productID, quantity, user }) {
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // set Add to Cart button Loading spinner timeout
  useEffect(() => {
    let timeout;
    if (success) {
      timeout = setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [success]);

  // check if Order Quantity is not more than Stock Quantity
  const handleOnChange = (event) => {
    if (Number(event.target.value) <= quantity) {
      setOrderQuantity(Number(event.target.value));
    }
  };

  const handleAddToCart = async (event) => {
    try {
      setLoading(true);
      const { token } = parseCookies({}, 'token');
      const headers = { headers: { Authorization: token } };
      const payload = { orderQuantity, productID };
      await axios.put(`${baseURL}/api/cart`, payload, headers);
      setSuccess(true);
    } catch (error) {
      catchErrors(error, window.alert);
    } finally {
      setLoading(false);
    }
  };

  const handleRouting = () => {
    return router.push('/login');
  };

  return (
    <>
      {!quantity ? (
        <Label size="medium" basic color="grey">
          Out of Stock
        </Label>
      ) : (
        <Input
          type="number"
          value={orderQuantity}
          placeholder="Qty"
          min="1"
          onChange={handleOnChange}
          action={
            user && success
              ? {
                  color: 'orange',
                  icon: 'in cart',
                  content: 'Product Added!',
                  labelPosition: 'right',
                  disabled: true
                }
              : user
              ? {
                  color: 'green',
                  icon: 'plus cart',
                  content: 'Add to Cart',
                  labelPosition: 'right',
                  onClick: handleAddToCart,
                  disabled: loading,
                  loading
                }
              : {
                  color: 'blue',
                  icon: 'sign in',
                  content: 'Sign in to Buy',
                  labelPosition: 'right',
                  onClick: handleRouting
                }
          }
        />
      )}
    </>
  );
}

export default AddProductToCart;
