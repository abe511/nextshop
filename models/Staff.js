import mongoose from 'mongoose';
import shortid from 'shortid';

const { String, Number } = mongoose.Schema.Types;

const StaffSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    default: shortid.generate()
  },
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  birthdate: {
    type: Number,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  salary: {
    type: Number,
    required: true
  },
  phone: {
    type: Number
  },
  description: {
    type: String
  }
});

export default mongoose.models.Staff || mongoose.model('Staff', StaffSchema);
