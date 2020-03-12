import { Card } from 'semantic-ui-react';

function ProductList({ products }) {
  // mapping product properties to items attribute
  function mapProductsToItems(products) {
    return products.map((product) => {
      return {
        header: product.name,
        image: product.mediaUrl,
        color: 'grey',
        meta: `$${product.price}`,
        fluid: true,
        childKey: product._id,
        href: `/product?_id=${product._id}`
      };
    });
  }
  // Card Group (products) with items set to product properties
  return (
    <Card.Group
      stackable
      centered
      itemsPerRow="3"
      items={mapProductsToItems(products)}
    />
  );
}

export default ProductList;
