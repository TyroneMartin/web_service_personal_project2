// middleware/extractToken.js

const extractTokenMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }
  
    // Fetch the actual token value from environment variable
    const secretToken = process.env.SECRET_TOKEN;
  
    // Compare the token with the one from environment variable
    if (token !== secretToken) {
      return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }
  
    // If token is valid, proceed to next middleware or route handler
    next();
  };
  
  module.exports = extractTokenMiddleware;
  