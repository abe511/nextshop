import jwt from 'jsonwebtoken';
import Order from '../../models/Order';
import connectDB from '../../utils/connectDB';

connectDB();

export default async (req, res) => {
  try {
    //  verify token
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    // get Orders by userId, sort by date in descending order (latest on top) and populate the response with product data
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: 'desc' })
      .populate({
        path: 'products.product',
        model: 'Product'
      });
    res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    res.status(403).send('Please login again');
  }
};
