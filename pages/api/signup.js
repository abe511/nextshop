import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connectDB from '../../utils/connectDB';
import User from '../../models/User';
import Cart from '../../models/Cart';
import isEmail from 'validator/lib/isEmail';
import isLength from 'validator/lib/isLength';

connectDB();

export default async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1. validate name/email/password
    if (!isLength(name, { min: 2, max: 15 })) {
      return res.status(422).send('Name must be 2-15 characters long.');
    } else if (!isLength(password, { min: 6 })) {
      return res.status(422).send('Minimum password length is 6 characters.');
    } else if (!isEmail(email)) {
      return res.status(422).send('Please enter a valid e-mail address.');
    }
    // 2. check if the user already exists in db
    const user = await User.findOne({ email });
    if (user) {
      return res.status(422).send('User with this e-mail already exists');
    }
    // 3. if not - hash their password
    const hash = await bcrypt.hash(password, 10);
    // 4. create user
    const newUser = await new User({ name, email, password: hash }).save();
    // 5. create a Cart for a new user
    await new Cart({ user: newUser._id }).save();
    // 6. create a token for new user
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '11d'
    });
    // 6. send back the token
    res.status(201).json(token);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong. Please try again later.');
  }
};
