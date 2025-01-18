const express = require('express');
const filesController = require('../controllers/fileController');
const fileService = require('../services/fileService');

const router = express.Router();
const filesCtrl = new filesController(fileService);

router.get('/files', filesCtrl.get);
router.get('/files/:id', filesCtrl.getById);
router.post('/files', filesCtrl.create);
router.put('/files/:id', filesCtrl.update);
router.delete('/files/:id', filesCtrl.delete);
router.get('/files/download/:id', filesCtrl.download);

module.exports = router;