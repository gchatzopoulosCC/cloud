const service = require('../services/settingService');
const SettingsController = require('../controllers/settingController');
const settingsController = new SettingsController(service);

const express = require('express');
const router = express.Router();

router.get('/', settingsController.get);
router.put('/:id', settingsController.updateName);
router.put('/:id', settingsController.updatePassword);
router.put('/:id', settingsController.changePlan);
router.delete('/:id', settingsController.deleteAccount);

module.exports = router;