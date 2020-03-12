import Stripe from 'stripe';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import Cart from '../../models/Cart';
import Order from '../../models/Order';
import calculateCartTotal from '../../utils/calculateCartTotal';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export default async (req, res) => {
  const { paymentData } = req.body;

  try {
    // 1. get and verify userId from token
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    // 2. find Cart by userId and populate it
    const cart = await Cart.findOne({ user: userId }).populate({
      path: 'products.product',
      model: 'Product'
    });
    // 3. calculate Total again from Cart products
    const { cartTotal, stripeTotal } = calculateCartTotal(cart.products);
    // 4. get email from payment data, check if the email is linked with the existing Stripe customer
    let isExistingCustomer;
    let prevCustomer;
    try {
      // retrieve the first entry from the list of Stripe customers with the same email
      prevCustomer = await stripe.customers.list({
        email: paymentData.email,
        limit: 1
      });
      // true if at least one customer with the same email exists
      isExistingCustomer = prevCustomer.data.length > 0;
      res.status(200).send('Customer checked');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error checking Stripe DB for previous customer');
    }
    // 5. if no such customer, create a new one based on the email
    let newCustomer;
    let customer;
    try {
      // create new Stripe customer
      if (!isExistingCustomer) {
        newCustomer = await stripe.customers.create({
          email: paymentData.email,
          source: paymentData.id
        });
        res.status(200).send('New customer created');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error creating Stripe new customer');
    }

    // customer is either previous or new
    customer =
      (isExistingCustomer && prevCustomer.data[0].id) || newCustomer.id;

    // 6. create charge with Total, send receipt email (with LIVE API KEY only)
    // idempotencyKey prevents double charging
    try {
      await stripe.charges.create(
        {
          currency: 'usd',
          amount: stripeTotal,
          receipt_email: paymentData.email,
          customer,
          description: `Checkout | ${paymentData.email} | ${paymentData.id}`
        },
        { idempotencyKey: uuidv4() }
      );
    } catch (error) {
      console.error(error);
      res.status(500).send('Error creating Stripe charge');
    }
    // 7. add Order data to database
    await new Order({
      user: userId,
      email: paymentData.email,
      total: cartTotal,
      products: cart.products
    }).save();
    // 8. clear products in Cart
    await Cart.findOneAndUpdate({ _id: cart._id }, { $set: { products: [] } });
    // 9. send back OK (200) response
    res.status(200).send('Checkout successful');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing payment');
  }
};
