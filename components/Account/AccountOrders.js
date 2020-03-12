import { useRouter } from 'next/router';
import formatDate from '../../utils/formatDate';
import {
  Header,
  Segment,
  Accordion,
  List,
  Label,
  Image,
  Button,
  Icon
} from 'semantic-ui-react';

function AccountOrders({ orders }) {
  const router = useRouter();

  // creates a separate accordion section for each Order with its details inside
  function mapOrdersToPanels(orders) {
    return orders.map((order) => {
      return {
        key: order._id,
        title: {
          content: <Label color="blue" content={formatDate(order.createdAt)} />
        },
        content: {
          content: (
            <>
              {/* TOTAL */}
              <List.Header as="h3">
                <Label size="large" color="blue" basic>
                  Total: ${order.total}
                </Label>
                {/* EMAIL */}
                <Label
                  size="large"
                  content={order.email}
                  style={{ marginLeft: '1em' }}
                  icon="mail"
                  basic
                />
              </List.Header>
              {/* map Products array entries to separate sections in Orders*/}
              <List>
                {order.products.map((element) => {
                  return (
                    <List.Item key={element.product._id}>
                      {/* THUMBNAIL */}
                      <Image src={element.product.mediaUrl} avatar />
                      <List.Content>
                        {/* PRODUCT */}
                        <List.Header>{element.product.name}</List.Header>
                        {/* QTY & PRICE */}
                        <List.Description>
                          {element.orderQuantity} x {element.product.price}
                        </List.Description>
                      </List.Content>
                      {/* PRODUCT SUBTOTAL */}
                      <List.Content floated="right">
                        <Label
                          style={{ marginRight: '1em' }}
                          color="blue"
                          basic
                        >
                          Subtotal: $
                          {(
                            element.orderQuantity * element.product.price
                          ).toFixed(2)}
                        </Label>
                        {/* SKU */}
                        <Label
                          style={{ marginLeft: '1em' }}
                          color="grey"
                          size="tiny"
                          floated="right"
                          tag
                        >
                          {element.product.sku}
                        </Label>
                      </List.Content>
                    </List.Item>
                  );
                })}
              </List>
            </>
          )
        }
      };
    });
  }

  return (
    <>
      <Header as="h2">
        <Icon name="folder open" />
        Order History
      </Header>
      {orders.length === 0 ? (
        <Segment textAlign="center" color="grey" inverted tertiary>
          <Header icon>
            <Icon name="copy outline" />
            No orders yet.
          </Header>
          <div>
            <Button
              color="green"
              onClick={() => {
                router.push('/');
              }}
            >
              View Products
            </Button>
          </div>
        </Segment>
      ) : (
        <Accordion
          panels={mapOrdersToPanels(orders)}
          exclusive={false}
          fluid
          styled
        ></Accordion>
      )}
    </>
  );
}

export default AccountOrders;
