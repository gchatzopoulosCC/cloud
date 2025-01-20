const express = require('express');
const filesController = require('../controllers/fileController');
const FileService = require('../services/fileService');
const service = new FileService();
const upload = require('../middlewares/multer');
const validateFileName = require('../middlewares/validateFileName');

const router = express.Router();
const filesCtrl = new filesController(service);

/**
 * @swagger
 * /file:
 *   get:
 *     summary: Get all files
 *     responses:
 *       '200':
 *         description: List of files
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/File'
 *   post:
 *     summary: Create a new file
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FileCreate'
 *     responses:
 *       '201':
 *         description: File created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/File'
 *       '400':
 *         description: Validation error
 * /file/{id}:
 *   get:
 *     summary: Get a file by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID of the file
 *     responses:
 *       '200':
 *         description: File details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/File'
 *       '404':
 *         description: File not found
 *   put:
 *     summary: Change the file name by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID of the file
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: logo.png
 *     responses:
 *       '200':
 *         description: File details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/File'
 *       '400':
 *         description: Validation error
 *       '404':
 *         description: File not found
 *   delete:
 *     summary: Delete a file by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID of the file
 *     responses:
 *       '204':
 *         description: File deleted
 *       '403':
 *         description: Forbidden
 *       '404':
 *         description: File not found
 * components:
 *   schemas:
 *     File:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: logo.png
 *         size:
 *           type: integer
 *           example: 50000
 *         fileType:
 *           type: string
 *           example: .png
 *         path:
 *           type: string
 *           example: /2/logo.png
 *         userId:
 *           type: integer
 *           example: 2
 *     FileCreate:
 *       type: object
 *       properties:
 *         userId:
 *           type: integer
 *           example: 2
 *         file:
 *           type: string
 *           format: binary
 *           example: file
 */
router.get('/', filesCtrl.get);
router.get('/:id', filesCtrl.getById);
router.post('/', upload.single('file'), filesCtrl.upload);
router.put('/:id', validateFileName, filesCtrl.changeName);
router.delete('/:id', filesCtrl.delete);
router.get('/download/:id', filesCtrl.download);

module.exports = router;