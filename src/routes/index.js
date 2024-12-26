/* Route configuration */

const express = require('express');
const genericController = require('../controllers/genericController');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello World');
});

/* Routes with will be defines as:
router.get('/users', userController);
*/

module.exports = router;