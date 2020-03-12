function calculateCartTotal(products) {
  const total = products.reduce((sum, el) => {
    return sum + el.product.price * el.orderQuantity;
  }, 0);

  const cartTotal = ((total * 100) / 100).toFixed(2);
  const stripeTotal = Number((total * 100).toFixed(2));
  return { cartTotal, stripeTotal };
}

export default calculateCartTotal;
