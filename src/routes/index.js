/* Route configuration */

const express = require('express');
const userRoutes = require('./userRoutes');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello World');
});
router.use('/user', userRoutes);

/* Routes with will be defines as:
router.get('/users', userController);
*/

module.exports = router;