const SettingsService = require('../services/settingsService');
const service = new SettingsService();
const SettingsController = require('../controllers/settingsController');
const settingsController = new SettingsController(service);
const validateOwnership = require('../middlewares/validateOwnership');

const express = require('express');
const router = express.Router();

router.get('/', settingsController.get);
router.get('/:id', validateOwnership, settingsController.getById);
router.delete('/:id', validateOwnership, settingsController.delete);

module.exports = router;