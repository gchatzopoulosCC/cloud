/* Route configuration */

const express = require('express');
const userRoutes = require('./userRoutes');
const fileRoutes = require('./fileRoutes');
const settingsRoutes = require('./settingsRoutes');
// Swagger
const { swaggerUi, swaggerSpec } = require('../swagger');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello World');
});
router.use('/user', userRoutes);
router.use('/file', fileRoutes);
router.use('/settings', settingsRoutes);

// Swagger
router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


module.exports = router;