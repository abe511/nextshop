import mongoose from 'mongoose';
import shortid from 'shortid';

const { String, Number } = mongoose.Schema.Types;

const ProductSchema = new mongoose.Schema({
  sku: {
    type: String,
    unique: true,
    default: shortid.generate
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  mediaUrl: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  }
});

// check if the schema already exists or create a new one
export default mongoose.models.Product ||
  mongoose.model('Product', ProductSchema);
