const express = require('express');
const filesController = require('../controllers/fileController');
const fileService = require('../services/fileService');

const router = express.Router();
const filesCtrl = new filesController(fileService);

router.get('/', filesCtrl.get);
router.get('/:id', filesCtrl.getById);
router.post('/', filesCtrl.create);
router.put('/:id', filesCtrl.update);
router.delete('/:id', filesCtrl.delete);
router.get('/download/:id', filesCtrl.download);

module.exports = router;