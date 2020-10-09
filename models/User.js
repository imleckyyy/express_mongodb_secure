import mongoose from 'mongoose';

const { Schema } = mongoose;

const userModel = new Schema(
  {
    login: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: 'user' },
    twitchName: { type: String },
    youTubeName: { type: String },
    redditName: { type: String },
    futbinName: { type: String },
    futheadName: { type: String },
    futwizName: { type: String },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model('user', userModel);
