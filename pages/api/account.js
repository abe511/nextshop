import jwt from 'jsonwebtoken';
import User from '../../models/User';
import connectDB from '../../utils/connectDB';

connectDB();

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
    default: {
      res.status(405).send(`Method ${req.method} not allowed`);
      break;
    }
  }
};

async function handleGetRequest(req, res) {
  //   check for Authorization header
  if (!req.headers.authorization) {
    return res.status(401).send('No authorization token');
  }

  try {
    // verify and sign the token using the Secret
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    const user = await User.findOne({ _id: userId });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    res.status(403).send('Invalid token');
  }
}

// send PUT request to update user role
async function handlePutRequest(req, res) {
  const { _id, role } = req.body;
  await User.findOneAndUpdate({ _id }, { role });
  res.status(203).send('User updated');
}
