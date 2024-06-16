const extractTokenMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }
  
    // Retrieve the user's access token from the session or database
    const userAccessToken = req.session.accessToken || getUserAccessToken(req.user.id);
  
    // Compare the token with the user's access token
    if (token !== userAccessToken) {
      return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }
  
    // If token is valid, proceed to next middleware or route handler
    next();
  };
  
  module.exports = extractTokenMiddleware;
  