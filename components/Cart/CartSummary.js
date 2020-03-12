import { useState, useEffect } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { Button, Segment } from 'semantic-ui-react';
import calculateCartTotal from '../../utils/calculateCartTotal';

function CartSummary({ success, products, handleCheckout }) {
  const [cartAmount, setCartAmount] = useState(0);
  const [stripeAmount, setStripeAmount] = useState(0);
  const [isCartEmpty, setCartEmpty] = useState(false);

  useEffect(() => {
    const { cartTotal, stripeTotal } = calculateCartTotal(products);
    setCartAmount(cartTotal);
    setStripeAmount(stripeTotal);
    setCartEmpty(products.length === 0);
  }, [products]);

  return (
    <>
      <Segment size="large" clearing>
        Sub total: <strong>${cartAmount} </strong>
        <StripeCheckout
          name="The NEXT Shop"
          amount={stripeAmount}
          image={products.length > 0 ? products[0].product.mediaUrl : ''}
          currency="USD"
          shippingAddress={true}
          billingAddress={true}
          zipCode={true}
          token={handleCheckout}
          triggerEvent="onClick"
          stripeKey="pk_test_TivgOZ0bvPHvSpbdxE86JOJa00yxXPrPgv"
        >
          <Button
            content="Checkout"
            color="green"
            icon="cart"
            floated="right"
            disabled={isCartEmpty || success}
          />
        </StripeCheckout>
      </Segment>
    </>
  );
}

export default CartSummary;
