import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connectDB from '../../utils/connectDB';
import User from '../../models/User';

connectDB();

export default async function(req, res) {
  const { email, password } = req.body;
  try {
    // 1. check if the user with provided email exists
    const user = await User.findOne({ email }).select('+password');
    // 2. if not - return and error
    if (!user) {
      return res.status(404).send('Wrong email');
    }
    // 3. check if the password matches with the one in db
    const passwordsMatch = await bcrypt.compare(password, user.password);
    // 4. if true - generate a token
    if (passwordsMatch) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '11d'
      });
      // 5. sent the token to the client
      res.status(200).json(token);
    } else {
      res.status(401).send('Wrong password.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error logging in.');
  }
}
