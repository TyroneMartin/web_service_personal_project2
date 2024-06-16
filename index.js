const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { auth, requiresAuth } = require('express-openid-connect');
const mongodb = require('./db/connect');

const app = express();

app.use(express.static('static'));

// Serve static files (e.g., index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/static/index.html'));
});

// Redirect to GitHub OAuth authorization
app.get('/auth', (req, res) => {
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`,
  );
});

// Handle GitHub OAuth callback
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
      console.log('My token:', token);
      res.redirect(`/?token=${token}`);
    })
    .catch((err) => res.status(500).json({ err: err.message }));
});

// Logout route (if needed)
// app.get('/logout', (req, res) => {
//   req.logout(); // Clears the session and logs out the user
//   res.redirect('https://web-service-personal-project2.onrender.com'); // Redirect to GitHub logout endpoint
// });

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Middleware to set CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// Routes defined in separate files (e.g., ./routes/accounts.js)
app.use('/', require('./routes'));

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
