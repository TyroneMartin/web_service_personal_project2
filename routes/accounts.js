const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accounts');
// Middleware to extract token
router.use(extractTokenMiddleware);


// Routes for accounts controller
// router.get('/', accountController.getAllAccounts); 
// http://localhost:8080/accounts

// Route for accounts controller with token validation
router.get('/', (req, res, next) => {
    if (!req.token) {
      return res.status(401).json({ error: 'Token missing' });
    }
    // Pass token to account controller
    req.token = req.token.replace('Bearer ', ''); // Remove 'Bearer ' if it's included in the authorization header
    next();
  }, accountController.getAllAccounts);


router.get('/:id', accountController.getSingleAccount);
router.post('/', accountController.createAccount);
router.put('/:id', accountController.updateAccount);
router.delete('/:id', accountController.deleteAccount);

// router.patch('/admin/:id', accountController.adminupdateAccount);

module.exports = router;