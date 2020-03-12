import { useRouter } from 'next/router';
import CartSummary from './CartSummary';
import {
  Header,
  Segment,
  Button,
  Icon,
  Item,
  Divider,
  Message
} from 'semantic-ui-react';

function CartItemList({
  user,
  success,
  products,
  handleCheckout,
  handleRemoveFromCart
}) {
  const router = useRouter();

  function mapCartProductsToItems(products) {
    // display each product as Cart Item with Header link to Product page and Remove from Cart button
    return products.map((el) => {
      return {
        childKey: el.product._id,
        image: el.product.mediaUrl,
        header: (
          <Item.Header
            as="a"
            onClick={() => {
              router.push(`/product?_id=${el.product._id}`);
            }}
          >
            {el.product.name}
          </Item.Header>
        ),
        meta: `${el.orderQuantity} x $${el.product.price}`,
        extra: (
          <Button
            icon="remove"
            floated="right"
            onClick={() => {
              handleRemoveFromCart(el.product._id, el.orderQuantity);
            }}
            basic
          />
        )
      };
    });
  }

  if (success) {
    return (
      <Message
        header="Done!"
        content="Payment accepted!"
        icon="check"
        success
      />
    );
  }

  // if no Product in the Cart show Welcome screen
  if (!products.length) {
    return (
      <>
        <Segment
          color="violet"
          textAlign="center"
          secondary
          inverted
          placeholder
        >
          <Header icon>
            <Icon name="shopping basket" />
            Don't be shy! Shop here!
          </Header>
          <div>
            {user ? (
              <Button
                color="orange"
                onClick={() => {
                  router.push('/');
                }}
              >
                Start Shopping!
              </Button>
            ) : (
              <Button
                color="blue"
                onClick={() => {
                  router.push('/login');
                }}
              >
                Login to start shopping
              </Button>
            )}
          </div>
        </Segment>
      </>
    );
  }
  // if Cart is not empty show Cart Summary with each Product as Cart Item
  return (
    <>
      <Item.Group items={mapCartProductsToItems(products)} divided />
      <Divider />
      <CartSummary
        success={success}
        products={products}
        handleCheckout={handleCheckout}
      />
    </>
  );
}

export default CartItemList;
