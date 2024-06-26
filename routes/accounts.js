const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accounts');


// Routes for accounts controller
router.get('/', accountController.getAllAccounts); // http://localhost:8080/accounts
router.get('/:id', accountController.getSingleAccount);
router.post('/', accountController.createAccount);
router.put('/:id', accountController.updateAccount);
router.delete('/:id', accountController.deleteAccount);

module.exports = router;
