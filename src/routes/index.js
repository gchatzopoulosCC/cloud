/* Route configuration */

const express = require('express');
const userRoutes = require('./userRoutes');
const fileRoutes = require('./fileRoutes');
const settingRoutes = require('./settingRoutes');
// Swagger
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = YAML.load('./swagger.yaml');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello World');
});
router.use('/user', userRoutes);
router.use('/file', fileRoutes);
router.use('/setting', settingRoutes);

// Swagger
router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


module.exports = router;