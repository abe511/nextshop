import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Cart from '../../models/Cart';
import Product from '../../models/Product';
import connectDB from '../../utils/connectDB';

const { ObjectId } = mongoose.Types;

connectDB();

// GET method populates the Cart page with products
// PUT method adds a product to the Cart
export default async (req, res) => {
  switch (req.method) {
    case 'GET': {
      await handleGetRequest(req, res);
      break;
    }
    case 'PUT': {
      await handlePutRequest(req, res);
      break;
    }
    case 'DELETE': {
      await handleDeleteRequest(req, res);
      break;
    }
    default: {
      res.status(405).send(`Method ${req.method} not allowed`);
      break;
    }
  }

  async function handleGetRequest(req, res) {
    // check if the user is authorized
    if (!req.headers.authorization) {
      return res.status(401).send('No authorization token');
    }

    try {
      // verify auth token with the Secret
      const { userId } = jwt.verify(
        req.headers.authorization,
        process.env.JWT_SECRET
      );
      // find user Cart by userID and populate it with products
      const cart = await Cart.findOne({ user: userId }).populate({
        path: 'products.product',
        model: 'Product'
      });
      res.status(200).json(cart.products);
    } catch (error) {
      console.error(error);
      res.status(403).send('Invalid token. Log in again');
    }
  }

  async function handlePutRequest(req, res) {
    const { orderQuantity, productID } = req.body;
    // check if the user is authorized
    if (!req.headers.authorization) {
      return res.status(401).send('No authorization token');
    }
    try {
      // verify auth token with the Secret
      const { userId } = jwt.verify(
        req.headers.authorization,
        process.env.JWT_SECRET
      );

      // 1. get user Cart based on userId
      const cart = await Cart.findOne({ user: userId });
      // 2. check if the Product already exists in the Cart
      const productInCart = cart.products.some((el) => {
        return ObjectId(productID).equals(el.product);
      });
      // 3. if true - increment Quantity by number provided in the request
      // 4. if false - add provided Quantity of the Product to the Cart
      if (productInCart) {
        // find the Cart by ID
        // go to path 'products.product'
        // find the element in the Products array matching productID
        // select the Product with index $ and increment its orderQuantity
        await Cart.findOneAndUpdate(
          { _id: cart._id, 'products.product': productID },
          { $inc: { 'products.$.orderQuantity': orderQuantity } }
        );
        // decrease Product Stock Quantity by orderQuantity
        await Product.findOneAndUpdate(
          { _id: productID },
          { $inc: { quantity: -orderQuantity } }
        );
      } else {
        // construct new Product
        const newOrder = { orderQuantity, product: productID };
        // add a unique Product to the selected Cart
        await Cart.findOneAndUpdate(
          { _id: cart._id },
          { $addToSet: { products: newOrder } }
        );
        // decrease Product Stock Quantity by orderQuantity
        await Product.findOneAndUpdate(
          { _id: productID },
          { $inc: { quantity: -orderQuantity } }
        );
      }
      res.status(200).send('Cart updated');
    } catch (error) {
      console.error(error);
      res.status(403).send('Invalid token. Log in again');
    }
  }
};

async function handleDeleteRequest(req, res) {
  const { productID, orderQuantity } = req.query;
  // check if the user is authorized
  if (!req.headers.authorization) {
    return res.status(401).send('No authorization token');
  }

  try {
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );

    // remove the Product under productID from Products array
    // get the updated version of the document
    // repopulate the Products array with the products according to its model
    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { $pull: { products: { product: productID } } },
      { new: true }
    ).populate({
      path: 'products.product',
      model: 'Product'
    });
    // increase Product Stock Quantity by cancelled orderQuantity
    await Product.findOneAndUpdate(
      { _id: productID },
      { $inc: { quantity: orderQuantity } }
    );
    // respond with a new, repopulated array of products
    res.status(200).json(cart.products);
  } catch (error) {
    console.error(error);
    res.status(403).send('Invalid token. Log in again');
  }
}
