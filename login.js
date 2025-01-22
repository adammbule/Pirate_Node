import { db_pass, email } from './config.js';
import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';


const app = express();
const PORT = 3000;


app.use(cors());




mongoose.connect(`${db_pass}`, {

});


const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  sessionKey: { type: String, required: false },
});


const User = mongoose.model('User', userSchema);


app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {

    const user = await User.findOne({ email: email });


    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }


    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }


    const token = jwt.sign(
      { userId: '123', username: 'testUser' },
      'your_jwt_secret',
      { expiresIn: '1h' }
    );


    await User.findOneAndUpdate(
      { email: email },
      { sessionKey: token }
    );


    res.status(200).json({
      message: 'Login successful',
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
