const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

const router = express.Router(); // Create a router instance

// Swagger route
router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument)); // http://localhost:8080/api-docs


// Routes to other files
router.use('/accounts', require('./accounts')); // http://localhost:8080/accounts/
router.use('/degrees', require('./degrees')); // http://localhost:8080/degrees

// Export the router
module.exports = router;