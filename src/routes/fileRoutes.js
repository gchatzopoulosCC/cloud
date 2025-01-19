const express = require('express');
const filesController = require('../controllers/fileController');
const FileService = require('../services/fileService');
const service = new FileService();

const router = express.Router();
const filesCtrl = new filesController(service);

router.get('/', filesCtrl.get);
router.get('/:id', filesCtrl.getById);
router.post('/', filesCtrl.create);
router.put('/:id', filesCtrl.update);
router.delete('/:id', filesCtrl.delete);
router.get('/download/:id', filesCtrl.download);

module.exports = router;