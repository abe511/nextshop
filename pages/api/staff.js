import connectDB from '../../utils/connectDB';
import Staff from '../../models/Staff';

connectDB();

export default async (req, res) => {
  // retrieve all staff from DB
  const staff = await Staff.find();
  res.status(200).json(staff);
};
