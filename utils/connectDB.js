import mongoose from 'mongoose';

const connection = {};

async function connectDB() {
  if (connection.isConnected) {
    // use existing DB connection
    return;
  }

  // make a DB connection
  const db = await mongoose.connect(process.env.MONGO_SRV, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  });

  connection.isConnected = db.connections[0].readyState;
}

export default connectDB;
