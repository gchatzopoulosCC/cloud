const service = require('../services/settingService');
const SettingController = require('../controllers/settingController');
const settingController = new SettingController(service);

const express = require('express');
const router = express.Router();

router.get('/', settingController.get);
router.put('/:id', settingController.updateName);
router.put('/:id', settingController.updatePassword);
router.put('/:id', settingController.changePlan);
router.delete('/:id', settingController.deleteAccount);

module.exports = router;