const extractTokenMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }
  
    // Example: Verify token validity (replace with your actual token verification logic)
    if (token !== 'YOUR_SECRET_TOKEN') {
      return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }
  
    // If token is valid, proceed to next middleware or route handler
    next();
  };
  
  module.exports = extractTokenMiddleware;
  