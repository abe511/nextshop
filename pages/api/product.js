import Product from '../../models/Product';
import Cart from '../../models/Cart';
import connectDB from '../../utils/connectDB';

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case 'GET':
      await handleGetRequest(req, res);
      break;
    case 'POST':
      await handlePostRequest(req, res);
      break;
    case 'DELETE':
      await handleDeleteRequest(req, res);
      break;
    default:
      res.status(405).send(`Method ${req.method} not allowed.`);
      break;
  }
};

async function handleGetRequest(req, res) {
  // this comes from the request payload params
  const { _id } = req.query;
  // filter out the response so that _id in DB matches _id in the query
  const product = await Product.findOne({ _id });
  res.status(200).json(product);
}

async function handlePostRequest(req, res) {
  try {
    const { name, price, quantity, description, mediaUrl } = req.body;
    // check for empty fields in product creation form
    if (!name || !price || !quantity || !description || !mediaUrl) {
      return res.status(422).send('Insufficient product information provided.');
    }
    // construct the product to be saved in DB
    const product = await new Product({
      name,
      price,
      quantity,
      description,
      mediaUrl
    }).save();
    return res.status(201).json(product);
  } catch (error) {
    res.status(500).send('Server error');
  }
}

async function handleDeleteRequest(req, res) {
  const { _id } = req.query;

  try {
    // 1. delete product by ID
    await Product.findOneAndDelete({ _id });
    // 2. remove product from all carts referenced as "product"
    await Cart.updateMany(
      { 'products.product': _id },
      { $pull: { products: { product: _id } } }
    );
    // return No Content status
    res.status(204).json({});
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting product');
  }
}
