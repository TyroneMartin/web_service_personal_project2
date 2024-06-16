const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
// const { auth, requiresAuth } = require('express-openid-connect');
const axios = require('axios');
require('dotenv').config();

const mongodb = require('./db/connect');

const app = express();

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/static/index.html'));
});

app.get('/auth', (req, res) => {
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`,
  );
});

app.get('/oauth-callback', ({ query: { code } }, res) => {
  const body = {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_SECRET,
    code,
  };
  const opts = { headers: { accept: 'application/json' } };
  axios
    .post('https://github.com/login/oauth/access_token', body, opts)
    .then((_res) => _res.data.access_token)
    .then((token) => {
      // eslint-disable-next-line no-console
      console.log('My token:', token);

      res.redirect(`/?token=${token}`);
    })
    .catch((err) => res.status(500).json({ err: err.message }));
});

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Middleware to set CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// Routes defined in separate files (e.g., ./routes/accounts.js)
app.use('/more', require('./routes'));

// Initialize MongoDB connection
mongodb.initDb((err, db) => {
  if (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1); // Exit the process if MongoDB connection fails
  }
  console.log('Connected to MongoDB');

  // Start the Express.js server
  const port = process.env.PORT || 8080;
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
});
