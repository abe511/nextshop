import { Item, Label } from 'semantic-ui-react';
import AddProductToCart from './AddProductToCart';

function ProductSummary({ _id, name, price, mediaUrl, sku, quantity, user }) {
  let message = '';
  let color = '';
  if (quantity <= 5) {
    message = `Last ${quantity} remaining`;
    color = 'red';
  } else if (quantity <= 10) {
    message = `Only ${quantity} remaining`;
    color = 'orange';
  } else {
    message = `${quantity} in Stock`;
    color = 'green';
  }
  return (
    <Item.Group>
      <Item>
        <Item.Image size="medium" src={mediaUrl} />
        <Item.Content>
          <Item.Header>{name}</Item.Header>
          <Item.Description>
            <p>${price}</p>
            <Label>Stock Number: {sku}</Label>
          </Item.Description>
          <Item.Extra>
            {quantity ? (
              <>
                <AddProductToCart
                  productID={_id}
                  quantity={quantity}
                  user={user}
                />
                <Label basic color={color}>
                  {message}
                </Label>
              </>
            ) : (
              <AddProductToCart productID={_id} quantity={quantity} />
            )}
          </Item.Extra>
        </Item.Content>
      </Item>
    </Item.Group>
  );
}

export default ProductSummary;
