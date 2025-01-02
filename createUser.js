// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// In-memory storage for users (this can be replaced by a database)
let users = [];

// POST route to create a new user
app.post('/create-user', (req, res) => {
  const { username, password, email } = req.body;

  // Simple validation (ensure both username and password are provided)
  if (!username || !password || !email) {
    return res.status(400).json({ message: 'Username, email and password are required.' });
  }


  //check if email exists
    const existingEmail = users.find(user => user.email === email);
      if (existingEmail) {
        return res.status(409).json({ message: 'Email already exists.' });
      }

  // Check if the username already exists
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(409).json({ message: 'Username already exists.' });
  }



  // Store the new user (in memory for now)
  const newUser = { username, password, email }; // In a real-world app, you would hash the password
  users.push(newUser);

  // Respond with the created user
  res.status(201).json({ message: 'User created successfully.', user: newUser });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
