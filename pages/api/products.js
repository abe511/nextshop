import connectDB from '../../utils/connectDB';
import Product from '../../models/Product';

connectDB();

export default async (req, res) => {
  const { page, size } = req.query;
  let products = [];
  // convert query strings to numbers
  const pageNum = Number(page);
  const pageSize = Number(size);
  // find total page quantity
  const totalDocs = await Product.countDocuments();
  const totalPages = Math.ceil(totalDocs / pageSize);

  // retrieve products for the page 'pageNum' from DB
  // 'start' when greater than 0, indicates how many documents to skip
  // 'pageSize' is the limit of documents for each page
  const start = pageSize * (pageNum - 1);
  if (start) {
    products = await Product.find()
      .skip(start)
      .limit(pageSize);
  } else {
    products = await Product.find().limit(pageSize);
  }

  res.status(200).json({ products, totalPages });
};
