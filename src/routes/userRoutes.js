const service = require('../services/userService');
const UserController = require('../controllers/userController');
const userController = new UserController(service);

const express = require('express');
const router = express.Router();

router.get('/', userController.get);
router.get('/:id', userController.getById);
router.post('/', userController.create);
router.put('/:id', userController.update);
router.delete('/:id', userController.delete);

module.exports = router;