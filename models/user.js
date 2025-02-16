import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  sessionKey: { type: String },
});

const User = mongoose.model('User', userSchema); // Capital 'U' for the model name

export default User; // Export the User model