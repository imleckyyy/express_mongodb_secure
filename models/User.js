import mongoose from 'mongoose';

const { Schema } = mongoose;

const userModel = new Schema({
  login: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: 'user' },
});

export default mongoose.model('user', userModel);
